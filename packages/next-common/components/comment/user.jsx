import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DVTag from "../detail/common/DVTag";
import SystemUser from "../user/systemUser";

export default function CommentUser({ author }) {
  const type = useDetailType();

  if (type === detailPageCategory.GOV2_REFERENDUM) {
    return (
      <div className="flex items-center gap-x-2">
        <SystemUser user={author} />
        <DVTag address={author?.address} />
      </div>
    );
  }

  return <SystemUser user={author} />;
}
