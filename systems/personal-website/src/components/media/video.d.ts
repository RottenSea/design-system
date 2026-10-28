export type VideoProvider = "youtube" | "bilibili" | "acfun" | "vimeo" | "file";

export interface VideoSource {
  /** Undefined when `src` was taken as a player's address as it is. */
  provider?: VideoProvider;
  /** "file" plays through <video>; "iframe" loads a player. */
  kind: "iframe" | "file";
  /** The player's address, or the file. */
  embed: string;
  /** The video's own page, for the link that works without script. */
  page: string;
}

/**
 * Where a video plays and where it lives, from a video page's URL (YouTube, Bilibili, AcFun,
 * Vimeo), a file URL, a player's own address, or a provider and id.
 */
export function videoSource(options: {
  provider?: string;
  videoId?: string;
  src?: string;
}): VideoSource | undefined;
