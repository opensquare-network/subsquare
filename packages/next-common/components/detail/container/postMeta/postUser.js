import { usePost } from "../../../../context/post";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import SystemUser from "next-common/components/user/systemUser";
import AddressUser from "next-common/components/user/addressUser";

export default function PostUser() {
  const post = usePost();
  const { sm } = useScreenSize();
  const userMaxWidth = sm ? 236 : 370;
  const userFontSize = 12;

  if (post?.author) {
    return (
      <SystemUser
        user={post?.author}
        fontSize={userFontSize}
        maxWidth={userMaxWidth}
      />
    );
  }

  return (
    <AddressUser
      add={post?.proposer || post?.finder}
      fontSize={userFontSize}
      maxWidth={userMaxWidth}
    />
  );
}
