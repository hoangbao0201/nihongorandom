import Image from "next/image";
import Link from "next/link";
import { getGithubContributors } from "@/lib/githubContributors";

export default async function SiteFooter() {
  const contributors = await getGithubContributors();

  return (
    <footer className="relative z-10 mt-auto border-t border-white/6 bg-[rgba(12,15,20,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-5 sm:px-6">
        <p className="text-xs text-white/35">Thành viên xây dựng</p>

        {contributors.length > 0 ? (
          <ul className="flex items-center -space-x-2">
            {contributors.map((contributor, index) => (
              <li
                key={contributor.login}
                className="relative transition-transform hover:z-20 hover:scale-110"
                style={{ zIndex: contributors.length - index }}
              >
                <Link
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={contributor.login}
                  aria-label={contributor.login}
                >
                  <Image
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 rounded-full ring-2 ring-[#0c0f14] transition-[box-shadow] hover:ring-[var(--accent-soft)]"
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-white/30">Đang tải...</p>
        )}
      </div>
    </footer>
  );
}
