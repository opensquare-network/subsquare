import useSubscribeAccount from "next-common/hooks/account/useSubAccount";
import Divider from "next-common/components/styled/layout/divider";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import CollectivesAccountInfo from "./components/collectiveAccountInfo";
import CollectivesDemotionPrompt from "./components/collectivesDemotionPrompt";
import { AccountHead, ProxyTip } from "./accountInfoPanel";
import AccountPanelScrollPrompt from "./components/accountPanelScrollPrompt";
import ManageAccountButton from "./components/manageAccountButton";
import FellowshipMemberDataProvider from "./context/fellowshipMemberDataContext";
import AmbassadorMemberDataProvider from "./context/ambassadorMemberDataContext";
import ExtensionUpdatePrompt from "./components/extensionUpdatePrompt";

export default function CollectivesAccountInfoPanel({ hideManageAccountLink }) {
  useSubscribeAccount();

  return (
    <FellowshipMemberDataProvider>
      <AmbassadorMemberDataProvider>
        <NeutralPanel className="p-6 space-y-4">
          <ProxyTip />
          <AccountHead />
          <Divider />

          <CollectivesAccountInfo />

          {!hideManageAccountLink && <ManageAccountButton />}

          <ExtensionUpdatePrompt />
          <AccountPanelScrollPrompt />
          <CollectivesDemotionPrompt />
        </NeutralPanel>
      </AmbassadorMemberDataProvider>
    </FellowshipMemberDataProvider>
  );
}
