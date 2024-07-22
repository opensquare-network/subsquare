import { useUser } from "next-common/context/user";
import NotLoginPanel from "./notLoginPanel";
import AccountInfoPanel from "./accountInfoPanel";
import NoLinkAddress from "./noLinkAddress";
import { isCollectivesChain } from "next-common/utils/chain";
import FellowshipMemberDataProvider from "./context/fellowshipMemberDataContext";
import AmbassadorMemberDataProvider from "./context/ambassadorMemberDataContext";
import { useChain } from "next-common/context/chain";

export default function AccountInfo({ hideManageAccountLink }) {
  const user = useUser();
  const chain = useChain();

  if (!user) {
    return <NotLoginPanel />;
  }

  if (user && !user.address) {
    return <NoLinkAddress />;
  }

  if (isCollectivesChain(chain)) {
    return (
      <FellowshipMemberDataProvider>
        <AmbassadorMemberDataProvider>
          <AccountInfoPanel hideManageAccountLink={hideManageAccountLink} />
        </AmbassadorMemberDataProvider>
      </FellowshipMemberDataProvider>
    );
  }

  return <AccountInfoPanel hideManageAccountLink={hideManageAccountLink} />;
}
