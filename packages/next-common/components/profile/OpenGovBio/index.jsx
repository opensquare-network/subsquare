import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { usePageProps } from "next-common/context/page";
import FellowshipTagInfo from "../fellowshipTagInfo";
import { DisplayUserAvatar, DisplayUser, DisplayUserAddress } from "../bio";
import Divider from "next-common/components/styled/layout/divider";
import OpenGovAssetInfo from "./openGovAssetInfo";
import WindowSizeProvider from "next-common/context/windowSize";

import UserAccountProvider from "next-common/context/user/account";

// TODO: responsive
export default function OpenGovBio() {
  const { user, id } = usePageProps();

  const address =
    isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;

  return (
    <UserAccountProvider address={address}>
      <WindowSizeProvider>
        <div className="w-full flex flex-col  px-0 py-6 mt-0  gap-4">
          <DisplayUserAvatar address={address} user={user} />
          <div className="flex-1 justify-start items-start mt-0 flex-wrap w-full">
            <DisplayUser id={id} />
            <DisplayUserAddress
              address={address}
              className="flex-1 !items-start"
            />

            <FellowshipTagInfo address={address} />
            <FellowshipTagInfo
              address={address}
              pallet="ambassadorCollective"
              type="ambassador"
            />

            <Divider className="my-4 w-full" />

            <OpenGovAssetInfo />
          </div>
        </div>
      </WindowSizeProvider>
    </UserAccountProvider>
  );
}
