import { usePost } from "../../../../context/post";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import SystemUser from "next-common/components/user/systemUser";
import AddressUser from "next-common/components/user/addressUser";
import PolkassemblyUser from "next-common/components/user/polkassemblyUser";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default function PostUser() {
  const post = usePost();
  const detailType = useDetailType();
  const { sm } = useScreenSize();
  const userMaxWidth = sm ? 236 : 370;
  const userFontSize = 12;

  if (detailType === detailPageCategory.PA_POST) {
    return (
      <PolkassemblyUser
        user={post?.author}
        fontSize={userFontSize}
        maxWidth={userMaxWidth}
      />
    );
  }

  if (post?.author) {
    return (
      <SystemUser
        user={post?.author}
        fontSize={userFontSize}
        maxWidth={userMaxWidth}
      />
    );
  } else if (post?.proposer || post?.finder) {
    return (
      <AddressUser
        add={post?.proposer || post?.finder}
        fontSize={userFontSize}
        maxWidth={userMaxWidth}
      />
    );
  } else if (Array.isArray(post?.authors)) {
    return (
      <AddressUser
        add={post?.authors[0]}
        fontSize={userFontSize}
        maxWidth={userMaxWidth}
      />
    );
  }
}
