import businessCategory from "next-common/utils/consts/business/category";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import { PolkassemblyUser } from "../user";
import SystemUser from "../user/systemUser";
import AddressUser from "../user/addressUser";

export default function PostUser({ data, type }) {
  const { sm } = useScreenSize();
  const userMaxWidth = sm ? 160 : 240;
  const userFontSize = 12;

  if (type === businessCategory.polkassemblyDiscussions) {
    return (
      <PolkassemblyUser
        user={data?.author}
        fontSize={userFontSize}
        maxWidth={userMaxWidth}
      />
    );
  }

  if (data?.author) {
    return (
      <SystemUser
        user={data?.author}
        fontSize={userFontSize}
        maxWidth={userMaxWidth}
      />
    );
  }

  return (
    <AddressUser
      add={data.address}
      fontSize={userFontSize}
      maxWidth={userMaxWidth}
    />
  );
}
