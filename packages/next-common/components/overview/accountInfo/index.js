import { useUser } from "next-common/context/user";
import NotLoginPanel from "./notLoginPanel";
import AccountInfoPanel from "./accountInfoPanel";
import NoLinkAddress from "./noLinkAddress";
import { isCollectivesChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";
import CollectivesAccountInfoPanel from "./collectivesAccountInfoPanel";

export default function AccountInfo() {
  const user = useUser();
  const chain = useChain();

  if (!user) {
    return <NotLoginPanel />;
  }

  if (user && !user.address) {
    return <NoLinkAddress />;
  }

  if (isCollectivesChain(chain)) {
    return <CollectivesAccountInfoPanel />;
  }

  return <AccountInfoPanel />;
}
