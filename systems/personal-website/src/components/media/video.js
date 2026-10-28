// Works out which site a video is on and the address of its player. Plain JavaScript, so the
// directive plugin, which Node loads straight from node_modules, can use it as well as
// VideoEmbed. Providers are URL builders only: no SDK and no script from the video site.

/** Seconds from YouTube's t parameter: "90", "90s" or "1m30s". */
function seconds(value) {
  if (!value) return undefined;
  if (/^\d+$/.test(value)) return Number(value);
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match || !match[0]) return undefined;
  const [, h = 0, m = 0, s = 0] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

const PLAYERS = {
  // YouTube's privacy-enhanced domain sets no cookies until the reader plays the video.
  youtube: (id, start) =>
    `https://www.youtube-nocookie.com/embed/${id}?autoplay=1${start ? `&start=${start}` : ""}`,
  bilibili: (id, part) => {
    const key = /^BV/i.test(id) ? `bvid=${id}` : `aid=${id.replace(/^av/i, "")}`;
    return `https://player.bilibili.com/player.html?${key}${part ? `&p=${part}` : ""}&autoplay=1`;
  },
  acfun: (id) => `https://www.acfun.cn/player/ac${id}`,
  vimeo: (id) => `https://player.vimeo.com/video/${id}?autoplay=1`
};

const PAGES = {
  youtube: (id, start) => `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}` : ""}`,
  bilibili: (id, part) => `https://www.bilibili.com/video/${id}${part ? `?p=${part}` : ""}`,
  acfun: (id) => `https://www.acfun.cn/v/ac${id}`,
  vimeo: (id) => `https://vimeo.com/${id}`
};

const FILE = /\.(mp4|webm|ogg)(?:[?#]|$)/i;

/** The provider, id and extra (start or part) a video page's URL points to. */
function parse(src) {
  let url;
  try {
    url = new URL(src);
  } catch {
    return undefined;
  }
  const host = url.hostname.replace(/^(www|m)\./, "");
  const path = url.pathname;
  if (host === "youtu.be") {
    return { provider: "youtube", id: path.slice(1), extra: seconds(url.searchParams.get("t")) };
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const id = url.searchParams.get("v") ?? path.match(/^\/(?:shorts|embed|live)\/([\w-]+)/)?.[1];
    return id ? { provider: "youtube", id, extra: seconds(url.searchParams.get("t")) } : undefined;
  }
  if (host === "bilibili.com") {
    const id = path.match(/^\/video\/((?:BV|av)\w+)/i)?.[1];
    return id ? { provider: "bilibili", id, extra: url.searchParams.get("p") ?? undefined } : undefined;
  }
  if (host === "acfun.cn") {
    const id = path.match(/^\/v\/ac(\d+(?:_\d+)?)/)?.[1];
    return id ? { provider: "acfun", id } : undefined;
  }
  if (host === "vimeo.com") {
    const id = path.match(/^\/(\d+)/)?.[1];
    return id ? { provider: "vimeo", id } : undefined;
  }
  return undefined;
}

/**
 * Where a video plays and where it lives.
 * @param {{ provider?: string, videoId?: string, src?: string }} options
 * @returns {{ provider?: string, kind: "iframe" | "file", embed: string, page: string } | undefined}
 */
export function videoSource({ provider, videoId, src }) {
  if (provider === "file" || (src && FILE.test(src))) {
    return src ? { provider: "file", kind: "file", embed: src, page: src } : undefined;
  }
  if (provider && videoId && PLAYERS[provider]) {
    return { provider, kind: "iframe", embed: PLAYERS[provider](videoId), page: PAGES[provider](videoId) };
  }
  if (!src) return undefined;
  const found = parse(src);
  if (found) {
    const { provider: site, id, extra } = found;
    return { provider: site, kind: "iframe", embed: PLAYERS[site](id, extra), page: PAGES[site](id, extra) };
  }
  // Any other address is taken as a player's own address, as the handoff does.
  return { kind: "iframe", embed: src, page: src };
}
