import { detailPageCategory } from "../../utils/consts/business/category";
import { isNil } from "lodash-es";

function getTypeProperties(context) {
  let url = context.resolvedUrl;
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

  return {};
}

export function getIdProperty(context) {
  const { id } = context.query;
  return isNil(id) ? {} : { id };
}

export default function getDetailPageProperties(context) {
  return {
    ...getTypeProperties(context),
    ...getIdProperty(context),
  };
}
