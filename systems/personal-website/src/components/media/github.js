// Fetches a repository's details from GitHub when the site builds, for GitHubCard. Each repository
// is asked for once per build. A failed request gives undefined and a warning, never an error, so
// the card falls back to its name and link and the build goes on.
//
// Without a token GitHub allows 60 requests an hour from one address, which a shared build
// machine can use up; a GITHUB_TOKEN in the build's environment raises that to 5,000.

const cache = new Map();

/**
 * @param {string} repo "owner/name"
 * @returns {Promise<{ description?: string, language?: string, stars: number, forks: number,
 *   license?: string, topics: string[], archived: boolean, url: string } | undefined>}
 */
export function repository(repo) {
  let result = cache.get(repo);
  if (!result) {
    result = load(repo);
    cache.set(repo, result);
  }
  return result;
}

async function load(repo) {
  const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      signal: AbortSignal.timeout(10_000)
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const data = await response.json();
    return {
      description: data.description ?? undefined,
      language: data.language ?? undefined,
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      // GitHub reports a license it cannot name as NOASSERTION; that says nothing to a reader.
      license: data.license?.spdx_id && data.license.spdx_id !== "NOASSERTION" ? data.license.spdx_id : undefined,
      topics: data.topics ?? [],
      archived: Boolean(data.archived),
      url: data.html_url ?? `https://github.com/${repo}`
    };
  } catch (error) {
    console.warn(`GitHubCard: could not load ${repo} from GitHub (${error.message}); showing its name only.`);
    return undefined;
  }
}
