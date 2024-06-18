import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DVTag from "next-common/components/detail/common/DVTag";
import AddressUser from "next-common/components/user/addressUser";

export default function CommentUser({ address }) {
  const type = useDetailType();

  if (type === detailPageCategory.GOV2_REFERENDUM) {
    return (
      <div className="flex items-center gap-x-2">
        <AddressUser add={address} />
        <DVTag address={address} />
      </div>
    );
  }

  return <AddressUser add={address} />;
}
