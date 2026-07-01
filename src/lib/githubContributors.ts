const CONTRIBUTORS_API_URL =
  "https://api.github.com/repos/hoangbao0201/nihongorandom/contributors";

export interface GithubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export async function getGithubContributors(): Promise<GithubContributor[]> {
  try {
    const response = await fetch(CONTRIBUTORS_API_URL, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data.reverse().filter(
      (item): item is GithubContributor =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as GithubContributor).login === "string" &&
        typeof (item as GithubContributor).avatar_url === "string" &&
        typeof (item as GithubContributor).html_url === "string" &&
        typeof (item as GithubContributor).contributions === "number"
    );
  } catch {
    return [];
  }
}
