import { detailPageCategory } from "../../utils/consts/business/category";

export default function getDetailPageProperties(url) {
  if (!url) {
    return null;
  }

  for (const type of Object.values(detailPageCategory)) {
    if (url.slice(1).startsWith(type)) {
      return {
        isDetail: true,
        type,
      };
    }
  }

  return null;
}
