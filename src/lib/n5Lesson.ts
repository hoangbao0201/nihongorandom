import { access, readFile } from "fs/promises";
import { join } from "path";
import type { IN5PartData, N5PartId } from "@/src/lib/n5Types";

export const N5_LESSON_COUNT = 25;

export const N5_PART_IDS: N5PartId[] = [
  "tuvung",
  "nguphap",
  "luyendoc",
  "hoithoai",
  "luyennghe",
  "baitap",
  "hantu",
  "luyenchuhan",
  "dochieu",
  "kiemtra",
  "thamkhao",
];

export interface IN5LessonPart {
  id: string;
  href: string;
  label: string;
}

export interface IN5LessonMenu {
  data: IN5LessonPart[];
}

export interface IN5LessonListItem {
  index: number;
  hasContent: boolean;
  partCount: number;
}

const n5DataRoot = join(process.cwd(), "src", "data", "n5");

function lessonMenuPath(lessonNumber: number) {
  return join(n5DataRoot, String(lessonNumber), `b${lessonNumber}.json`);
}

export function getN5PartLabel(part: IN5LessonPart): string {
  return part.label.replace(/^Phần\s+\d+:\s*/i, "");
}

export function isN5PartId(value: string): value is N5PartId {
  return (N5_PART_IDS as readonly string[]).includes(value);
}

export async function n5LessonMenuExists(
  lessonNumber: number
): Promise<boolean> {
  try {
    await access(lessonMenuPath(lessonNumber));
    return true;
  } catch {
    return false;
  }
}

export async function loadN5LessonMenu(
  lessonNumber: number
): Promise<IN5LessonMenu | null> {
  if (!(await n5LessonMenuExists(lessonNumber))) {
    return null;
  }

  const raw = await readFile(lessonMenuPath(lessonNumber), "utf8");
  return JSON.parse(raw) as IN5LessonMenu;
}

export async function getN5LessonList(): Promise<IN5LessonListItem[]> {
  return Promise.all(
    Array.from({ length: N5_LESSON_COUNT }, async (_, offset) => {
      const index = offset + 1;
      const menu = await loadN5LessonMenu(index);

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
    n5DataRoot,
    String(lessonNumber),
    `${partId}-b${lessonNumber}.json`
  );
}

export async function n5PartContentExists(
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

export async function loadN5PartContent(
  lessonNumber: number,
  partId: N5PartId
): Promise<IN5PartData | null> {
  if (!(await n5PartContentExists(lessonNumber, partId))) {
    return null;
  }

  const raw = await readFile(partContentPath(lessonNumber, partId), "utf8");
  return JSON.parse(raw) as IN5PartData;
}

export async function getPartFromMenu(
  lessonNumber: number,
  partId: string
): Promise<IN5LessonPart | null> {
  const menu = await loadN5LessonMenu(lessonNumber);
  return menu?.data.find((part) => part.id === partId) ?? null;
}
