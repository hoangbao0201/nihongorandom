import type { IN5PartData, N5PartId } from "@/lib/n5Types";
import {
  isDochieuData,
  isHantuData,
  isKiemtraData,
  isLuyenchuhanData,
  isTabSectionsData,
  isThamkhaoData,
  isTuvungData,
} from "@/lib/n5Guards";
import BaitapPartView from "@/components/modules/N5LessonParts/BaitapPartView";
import DochieuPartView from "@/components/modules/N5LessonParts/DochieuPartView";
import HantuPartView from "@/components/modules/N5LessonParts/HantuPartView";
import HoithoaiPartView from "@/components/modules/N5LessonParts/HoithoaiPartView";
import KiemtraPartView from "@/components/modules/N5LessonParts/KiemtraPartView";
import LuyenchuhanPartView from "@/components/modules/N5LessonParts/LuyenchuhanPartView";
import LuyendocPartView from "@/components/modules/N5LessonParts/LuyendocPartView";
import LuyennghePartView from "@/components/modules/N5LessonParts/LuyennghePartView";
import NguphapPartView from "@/components/modules/N5LessonParts/NguphapPartView";
import ThamkhaoPartView from "@/components/modules/N5LessonParts/ThamkhaoPartView";
import TuvungPartView from "@/components/modules/N5LessonParts/TuvungPartView";

interface N5PartRendererProps {
  partId: N5PartId;
  data: IN5PartData;
}

export default function N5PartRenderer({ partId, data }: N5PartRendererProps) {
  switch (partId) {
    case "tuvung":
      return isTuvungData(data) ? <TuvungPartView data={data} /> : null;
    case "hantu":
      return isHantuData(data) ? <HantuPartView data={data} /> : null;
    case "thamkhao":
      return isThamkhaoData(data) ? <ThamkhaoPartView data={data} /> : null;
    case "kiemtra":
      return isKiemtraData(data) ? <KiemtraPartView data={data} /> : null;
    case "dochieu":
      return isDochieuData(data) ? <DochieuPartView data={data} /> : null;
    case "luyenchuhan":
      return isLuyenchuhanData(data) ? <LuyenchuhanPartView data={data} /> : null;
    case "nguphap":
      return isTabSectionsData(data) ? <NguphapPartView data={data} /> : null;
    case "luyendoc":
      return isTabSectionsData(data) ? <LuyendocPartView data={data} /> : null;
    case "hoithoai":
      return isTabSectionsData(data) ? <HoithoaiPartView data={data} /> : null;
    case "luyennghe":
      return isTabSectionsData(data) ? <LuyennghePartView data={data} /> : null;
    case "baitap":
      return isTabSectionsData(data) ? <BaitapPartView data={data} /> : null;
    default:
      return null;
  }
}
