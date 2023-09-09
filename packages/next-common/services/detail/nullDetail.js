import { EmptyList } from "next-common/utils/constants";

export function getNullDetailProps(id, moreProps = {}) {
  return {
    props: {
      id,
      detail: null,
      comments: EmptyList,
      ...moreProps,
    },
  };
}
