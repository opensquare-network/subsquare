import Avatar from "next-common/components/avatar";
import { Wrapper } from "./styled";
import Gravatar from "next-common/components/gravatar";
import { useUser } from "next-common/context/user";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { AddressUser } from "next-common/components/user";
import Copyable from "next-common/components/copyable";
import tw from "tailwind-styled-components";
import { SystemProfile, SystemSetting } from "@osn/icons/subsquare";
import { useRouter } from "next/router";
import { isKeyRegisteredUser } from "next-common/utils";

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

const IconButton = tw.div`
  cursor-pointer
  flex
  justify-center
  items-center
  w-[32px]
  h-[32px]
  rounded-[8px]
  bg-neutral200
`;

export default function AccountInfoPanel() {
  const router = useRouter();
  const user = useUser();
  const isKeyUser = isKeyRegisteredUser(user);

  const goProfile = () => {
    router.push(`/user/${user?.address}`);
  };

  const goSetting = () => {
    if (isKeyUser) {
      router.push("/settings/key-account");
    } else {
      router.push("/settings/account");
    }
  };

  return (
    <Wrapper>
      <div className="flex justify-between items-center grow">
        <Account />
        <div className="flex gap-[16px]">
          <IconButton
            className="[&_svg_path]:fill-textSecondary"
            onClick={goProfile}
          >
            <SystemProfile width={20} height={20} />
          </IconButton>
          <IconButton
            className="[&_svg_path]:stroke-textSecondary"
            onClick={goSetting}
          >
            <SystemSetting width={20} height={20} />
          </IconButton>
        </div>
      </div>
    </Wrapper>
  );
}
