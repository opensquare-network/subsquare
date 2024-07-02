import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default function useSimaPostApiPath() {
  const type = useDetailType();
  if (type === detailPageCategory.POST) {
    return "sima/discussions";
  } else if (type === detailPageCategory.GOV2_REFERENDUM) {
    return "sima/referenda";
  }
  throw new Error(`Unknown detail page type: ${type}`);
}
