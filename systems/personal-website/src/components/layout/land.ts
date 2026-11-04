// Which points of DotGlobe's lattice fall on land, worked out at build time; the page gets the
// point count and one bit per point. The test is flat in longitude and latitude, which at this
// scale differs from a spherical test at only a few coastal points and is ten times faster.
// Shapes crossing 180° are unwrapped, and Antarctica is closed through the South Pole.
import { feature } from "topojson-client";
import atlas from "world-atlas/land-110m.json" with { type: "json" };
import { latticeCount, latticePoint } from "./sky.ts";

type Ring = number[][];
/** One landmass with the box it fits in, so most points skip the full test. */
interface Piece {
  rings: Ring[];
  west: number;
  east: number;
  south: number;
  north: number;
}

export interface LandMask {
  /** How many points the lattice has. */
  count: number;
  /** One bit per point, first point in the lowest bit of the first byte, as base64. */
  bits: string;
}

let pieces: Piece[] | undefined;
const cache = new Map<number, LandMask>();

/** Whether a ring jumps across the 180° meridian somewhere. */
const crosses = (ring: Ring) =>
  ring.some((p, i) => i > 0 && Math.abs(p[0] - ring[i - 1][0]) > 180);

/** A ring walked without jumps: each time it crosses 180°, what follows shifts by 360. */
function unwrap(ring: Ring): Ring {
  let shift = 0;
  return ring.map(([lon, lat], i) => {
    if (i > 0) {
      const step = lon - ring[i - 1][0];
      if (step > 180) shift -= 360;
      else if (step < -180) shift += 360;
    }
    return [lon + shift, lat];
  });
}

function piece(input: Ring[]): Piece {
  let rings = input;
  const outer = rings[0];
  const lons = outer.map((p) => p[0]);
  if (
    Math.max(...lons) - Math.min(...lons) > 350 &&
    Math.min(...outer.map((p) => p[1])) < -60
  ) {
    // Antarctica: drop the edge that closes it across the map and go round the pole instead.
    rings = [
      [...outer.slice(0, -1), [180, outer[0][1]], [180, -90], [-180, -90]],
      ...rings.slice(1)
    ];
  } else if (crosses(outer)) {
    rings = rings.map(unwrap);
  }
  const all = rings[0];
  return {
    rings,
    west: Math.min(...all.map((p) => p[0])),
    east: Math.max(...all.map((p) => p[0])),
    south: Math.min(...all.map((p) => p[1])),
    north: Math.max(...all.map((p) => p[1]))
  };
}

/** The land as separate polygons, each with its bounds. */
function landPieces(): Piece[] {
  const land = feature(
    atlas as unknown as Parameters<typeof feature>[0],
    (atlas as unknown as { objects: { land: Parameters<typeof feature>[1] } })
      .objects.land
  ) as unknown as {
    features: { geometry: { type: string; coordinates: unknown } }[];
  };
  return land.features.flatMap(({ geometry }) =>
    (geometry.type === "MultiPolygon"
      ? (geometry.coordinates as Ring[][])
      : [geometry.coordinates as Ring[]]
    ).map(piece)
  );
}

/** Even-odd ray casting: whether a point is inside a ring. */
function inRing(ring: Ring, lon: number, lat: number): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    )
      inside = !inside;
  }
  return inside;
}

function inPiece(p: Piece, lon: number, lat: number): boolean {
  if (lat < p.south || lat > p.north) return false;
  // Rings unwrap from their own starts, so a hole (the Caspian) may sit 360° from its outline.
  const at = [lon, lon + 360, lon - 360];
  if (!at.some((x) => x >= p.west && x <= p.east && inRing(p.rings[0], x, lat)))
    return false;
  return !p.rings.slice(1).some((hole) => at.some((x) => inRing(hole, x, lat)));
}

/** The land points of the lattice with `spacing` degrees between neighbours. */
export function landMask(spacing: number): LandMask {
  const cached = cache.get(spacing);
  if (cached) return cached;
  pieces ??= landPieces();
  const count = latticeCount(spacing);
  const bytes = new Uint8Array(Math.ceil(count / 8));
  for (let i = 0; i < count; i++) {
    const { x, y, z } = latticePoint(i, count);
    const lat = (Math.asin(y) * 180) / Math.PI;
    const lon = (Math.atan2(x, z) * 180) / Math.PI;
    if (pieces.some((p) => inPiece(p, lon, lat))) bytes[i >> 3] |= 1 << (i & 7);
  }
  const mask = { count, bits: Buffer.from(bytes).toString("base64") };
  cache.set(spacing, mask);
  return mask;
}
