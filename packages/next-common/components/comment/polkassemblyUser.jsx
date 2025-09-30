import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import PolkassemblyUser from "next-common/components/user/polkassemblyUser";
import DVTag from "../detail/common/DVTag";

export default function PolkassemblyCommentUser({ user }) {
  const type = useDetailType();

  if (!user) {
    return null;
  }

  if (type === detailPageCategory.GOV2_REFERENDUM) {
    return (
      <div className="flex items-center gap-x-2">
        <PolkassemblyUser user={user} />
        <DVTag address={user.address} />
      </div>
    );
  }

  return <PolkassemblyUser user={user} />;
}
