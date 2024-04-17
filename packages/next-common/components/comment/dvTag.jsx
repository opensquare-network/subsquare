import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import AddressDVTag from "../user/dvTag";

export default function CommentDVTag() {
  const type = useDetailType();

  if (type === detailPageCategory.GOV2_REFERENDUM) {
    return <AddressDVTag />;
  }

  return null;
}
