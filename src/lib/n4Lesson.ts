import { access, readFile } from "fs/promises";
import { join } from "path";
import type { IN5PartData, N5PartId } from "@/lib/n5Types";
import { isN5PartDataShape } from "@/lib/n5Guards";
import type { IN5LessonListItem, IN5LessonMenu, IN5LessonPart } from "@/lib/n5Lesson";
import { isN5PartId, getN5PartLabel } from "@/lib/n5Lesson";

export const N4_LESSON_FROM = 26;
export const N4_LESSON_TO = 50;
export const N4_LESSON_COUNT = N4_LESSON_TO - N4_LESSON_FROM + 1;

export const N4_LESSON_NUMBERS: number[] = Array.from(
  { length: N4_LESSON_COUNT },
  (_, offset) => N4_LESSON_FROM + offset
);

const n4DataRoot = join(process.cwd(), "src", "data", "n4");

function lessonMenuPath(lessonNumber: number) {
  return join(n4DataRoot, String(lessonNumber), `b${lessonNumber}.json`);
}

function isN4LessonMenu(value: unknown): value is IN5LessonMenu {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data)
  );
}

export function isN4LessonNumber(value: number): boolean {
  return (
    Number.isFinite(value) &&
    value >= N4_LESSON_FROM &&
    value <= N4_LESSON_TO
  );
}

export async function n4LessonMenuExists(
  lessonNumber: number
): Promise<boolean> {
  try {
    await access(lessonMenuPath(lessonNumber));
    return true;
  } catch {
    return false;
  }
}

export async function loadN4LessonMenu(
  lessonNumber: number
): Promise<IN5LessonMenu | null> {
  if (!(await n4LessonMenuExists(lessonNumber))) {
    return null;
  }

  const raw = await readFile(lessonMenuPath(lessonNumber), "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!isN4LessonMenu(parsed)) {
    return null;
  }

  // Only surface parts that already have converted JSON (partial N4 sync OK).
  const available: IN5LessonPart[] = [];
  for (const part of parsed.data) {
    if (await n4PartContentExists(lessonNumber, part.id)) {
      available.push(part);
    }
  }

  return { data: available };
}

export async function getN4LessonList(): Promise<IN5LessonListItem[]> {
  return Promise.all(
    N4_LESSON_NUMBERS.map(async (index) => {
      const menu = await loadN4LessonMenu(index);
      return {
        index,
        hasContent: Boolean(menu?.data?.length),
        partCount: menu?.data?.length ?? 0,
      };
    })
  );
}

function partContentPath(lessonNumber: number, partId: string) {
  return join(
    n4DataRoot,
    String(lessonNumber),
    `${partId}-b${lessonNumber}.json`
  );
}

export async function n4PartContentExists(
  lessonNumber: number,
  partId: string
): Promise<boolean> {
  try {
    await access(partContentPath(lessonNumber, partId));
    return true;
  } catch {
    return false;
  }
}

export async function loadN4PartContent(
  lessonNumber: number,
  partId: N5PartId
): Promise<IN5PartData | null> {
  if (!(await n4PartContentExists(lessonNumber, partId))) {
    return null;
  }

  const raw = await readFile(partContentPath(lessonNumber, partId), "utf8");
  const parsed: unknown = JSON.parse(raw);
  return isN5PartDataShape(parsed) ? parsed : null;
}

export async function getN4PartFromMenu(
  lessonNumber: number,
  partId: string
): Promise<IN5LessonPart | null> {
  const menu = await loadN4LessonMenu(lessonNumber);
  return menu?.data.find((part) => part.id === partId) ?? null;
}

export { isN5PartId as isN4PartId, getN5PartLabel as getN4PartLabel };
