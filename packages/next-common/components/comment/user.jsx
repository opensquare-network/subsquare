import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import SystemUser from "../user/systemUser";
import SystemUserWithDVTag from "../user/systemUserWithDV";

export default function CommentUser({ author }) {
  const type = useDetailType();

  if (type === detailPageCategory.GOV2_REFERENDUM) {
    return <SystemUserWithDVTag user={author} />;
  }

  return <SystemUser user={author} />;
}
