import { useUser } from "next-common/context/user";
import NotLoginPanel from "./notLoginPanel";
import AccountInfoPanel from "./accountInfoPanel";
import NoLinkAddress from "./noLinkAddress";

export default function AccountInfo({ hideManageAccountLink }) {
  const user = useUser();

  if (!user) {
    return <NotLoginPanel />;
  }

  if (user && !user.address) {
    return <NoLinkAddress />;
  }

  return <AccountInfoPanel hideManageAccountLink={hideManageAccountLink} />;
}
