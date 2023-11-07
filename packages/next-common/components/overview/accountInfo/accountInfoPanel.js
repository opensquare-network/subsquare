import Avatar from "next-common/components/avatar";
import { Wrapper } from "./styled";
import Gravatar from "next-common/components/gravatar";
import { useUser } from "next-common/context/user";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { AddressUser } from "next-common/components/user";
import Copyable from "next-common/components/copyable";

const DisplayUserAvatar = () => {
  const user = useUser();
  return user?.address ? (
    <Avatar address={user?.address} size={40} />
  ) : (
    <Gravatar emailMd5={user?.emailMd5} size={40} />
  );
};

const DisplayUser = () => {
  const user = useUser();
  const address = user?.address;
  if (isPolkadotAddress(address) || isEthereumAddress(address)) {
    return <AddressUser add={address} showAvatar={false} fontSize={14} />;
  }

  return <div className="text-textPrimary text14Bold">{user?.username}</div>;
};

function Account() {
  const user = useUser();

  return (
    <div className="flex gap-[12px]">
      <DisplayUserAvatar />
      <div className="flex flex-col">
        <DisplayUser />
        <Copyable className="text-textTertiary text14Medium">
          {user?.address}
        </Copyable>
      </div>
    </div>
  );
}

export default function AccountInfoPanel() {
  return (
    <Wrapper>
      <div className="flex justify-between">
        <Account />
      </div>
    </Wrapper>
  );
}
