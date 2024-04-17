import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import PolkassemblyUserWithDVTag from "../user/polkassemblyUserWithDV";
import PolkassemblyUser from "next-common/components/user/polkassemblyUser";

export default function PolkassemblyCommentUser({ user }) {
  const type = useDetailType();

  if (type === detailPageCategory.GOV2_REFERENDUM) {
    return <PolkassemblyUserWithDVTag user={user} />;
  }

  return <PolkassemblyUser user={user} />;
}
