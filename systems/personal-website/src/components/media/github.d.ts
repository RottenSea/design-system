export interface Repository {
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  /** SPDX id: "MIT". */
  license?: string;
  topics: string[];
  archived: boolean;
  url: string;
}

/** A repository's details from GitHub, fetched once per build; undefined when the request fails. */
export function repository(repo: string): Promise<Repository | undefined>;
