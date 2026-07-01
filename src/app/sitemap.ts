import type { MetadataRoute } from "next";
import { loadN5LessonMenu, N5_LESSON_COUNT } from "@/lib/n5Lesson";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/n5/lessons`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/n5/kanji`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  for (let lesson = 1; lesson <= N5_LESSON_COUNT; lesson++) {
    const menu = await loadN5LessonMenu(lesson);
    if (!menu?.data?.length) {
      continue;
    }

    entries.push({
      url: `${baseUrl}/n5/lessons/${lesson}`,
      changeFrequency: "monthly",
      priority: 0.7,
    });

    for (const part of menu.data) {
      entries.push({
        url: `${baseUrl}/n5/lessons/${lesson}/${part.id}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
