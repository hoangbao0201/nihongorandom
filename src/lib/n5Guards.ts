import type {
  IN5DochieuData,
  IN5HantuData,
  IN5KiemtraData,
  IN5LuyenchuhanData,
  IN5PartData,
  IN5TabSectionsData,
  IN5ThamkhaoData,
  IN5TuvungData,
} from "@/lib/n5Types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isHantuData(value: unknown): value is IN5HantuData {
  return isRecord(value) && value.type === "hantu" && Array.isArray(value.entries);
}

export function isThamkhaoData(value: unknown): value is IN5ThamkhaoData {
  return isRecord(value) && value.type === "thamkhao" && Array.isArray(value.sections);
}

export function isKiemtraData(value: unknown): value is IN5KiemtraData {
  return isRecord(value) && value.type === "kiemtra" && Array.isArray(value.sections);
}

export function isDochieuData(value: unknown): value is IN5DochieuData {
  return isRecord(value) && value.type === "dochieu" && Array.isArray(value.sections);
}

export function isLuyenchuhanData(value: unknown): value is IN5LuyenchuhanData {
  return isRecord(value) && value.type === "luyenchuhan";
}

// Tuvung là biến thể duy nhất KHÔNG có field `type` (phân biệt bằng cấu trúc).
export function isTuvungData(value: unknown): value is IN5TuvungData {
  return isRecord(value) && !("type" in value) && Array.isArray(value.sections);
}

// TabSections dùng chung cho nguphap/luyendoc/hoithoai/luyennghe/baitap: `type` là string mở.
export function isTabSectionsData(value: unknown): value is IN5TabSectionsData {
  return isRecord(value) && typeof value.type === "string" && Array.isArray(value.sections);
}

// Kiểm tra shape nông tại điểm dữ liệu vào: mọi IN5*Data đều có `lesson: number`.
export function isN5PartDataShape(value: unknown): value is IN5PartData {
  return isRecord(value) && typeof value.lesson === "number";
}
