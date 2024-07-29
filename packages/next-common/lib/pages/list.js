import { listPageCategory } from "../../utils/consts/business/category";

function getTypeProperties(context) {
  const url = context.resolvedUrl;
  if (!url) {
    return null;
  }

  for (const type of Object.values(listPageCategory)) {
    if (url.slice(1).startsWith(type)) {
      return {
        isList: true,
        listPageType: type,
      };
    }
  }

  return {};
}

export default function getListPageProperties(context) {
  return getTypeProperties(context);
}
