import type {
  IN5DochieuData,
  IN5HantuData,
  IN5KiemtraData,
  IN5LuyenchuhanData,
  IN5PartData,
  IN5TabSectionsData,
  IN5ThamkhaoData,
  IN5TuvungData,
  N5PartId,
} from "@/src/lib/n5Types";
import BaitapPartView from "@/src/components/modules/N5LessonParts/BaitapPartView";
import DochieuPartView from "@/src/components/modules/N5LessonParts/DochieuPartView";
import HantuPartView from "@/src/components/modules/N5LessonParts/HantuPartView";
import HoithoaiPartView from "@/src/components/modules/N5LessonParts/HoithoaiPartView";
import KiemtraPartView from "@/src/components/modules/N5LessonParts/KiemtraPartView";
import LuyenchuhanPartView from "@/src/components/modules/N5LessonParts/LuyenchuhanPartView";
import LuyendocPartView from "@/src/components/modules/N5LessonParts/LuyendocPartView";
import LuyennghePartView from "@/src/components/modules/N5LessonParts/LuyennghePartView";
import NguphapPartView from "@/src/components/modules/N5LessonParts/NguphapPartView";
import ThamkhaoPartView from "@/src/components/modules/N5LessonParts/ThamkhaoPartView";
import TuvungPartView from "@/src/components/modules/N5LessonParts/TuvungPartView";

interface N5PartRendererProps {
  partId: N5PartId;
  data: IN5PartData;
}

export default function N5PartRenderer({ partId, data }: N5PartRendererProps) {
  switch (partId) {
    case "tuvung":
      return <TuvungPartView data={data as IN5TuvungData} />;
    case "hantu":
      return <HantuPartView data={data as IN5HantuData} />;
    case "thamkhao":
      return <ThamkhaoPartView data={data as IN5ThamkhaoData} />;
    case "kiemtra":
      return <KiemtraPartView data={data as IN5KiemtraData} />;
    case "dochieu":
      return <DochieuPartView data={data as IN5DochieuData} />;
    case "luyenchuhan":
      return <LuyenchuhanPartView data={data as IN5LuyenchuhanData} />;
    case "nguphap":
      return <NguphapPartView data={data as IN5TabSectionsData} />;
    case "luyendoc":
      return <LuyendocPartView data={data as IN5TabSectionsData} />;
    case "hoithoai":
      return <HoithoaiPartView data={data as IN5TabSectionsData} />;
    case "luyennghe":
      return <LuyennghePartView data={data as IN5TabSectionsData} />;
    case "baitap":
      return <BaitapPartView data={data as IN5TabSectionsData} />;
    default:
      return null;
  }
}
