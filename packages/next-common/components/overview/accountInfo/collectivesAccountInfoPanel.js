import useSubscribeAccount from "next-common/hooks/account/useSubAccount";
import Divider from "next-common/components/styled/layout/divider";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import CollectivesAccountInfo from "./components/collectiveAccountInfo";
import CollectivesDemotionPrompt from "./components/collectivesDemotionPrompt";
import { AccountHead, ProxyTip } from "./accountInfoPanel";
import AccountPanelScrollPrompt from "./components/accountPanelScrollPrompt";
import ManageAccountButton from "./components/manageAccountButton";
import ExtensionUpdatePrompt from "./components/extensionUpdatePrompt";
import CollectivesClaimPrompt from "./components/collectivesClaimPrompt";
import useMemberData from "./hook/useMemberData";
import MemberDataProvider from "./context/memberDataContext";

export default function CollectivesAccountInfoPanel({ hideManageAccountLink }) {
  useSubscribeAccount();

  const fellowshipMemberData = useMemberData();
  const ambassadorMemberData = useMemberData("ambassador");

  return (
    <MemberDataProvider
      fellowshipMemberData={fellowshipMemberData}
      ambassadorMemberData={ambassadorMemberData}
    >
      <NeutralPanel className="p-6 space-y-4">
        <ProxyTip />
        <AccountHead />
        <Divider />

        <CollectivesAccountInfo />

        {!hideManageAccountLink && <ManageAccountButton />}

        <ExtensionUpdatePrompt />
        <AccountPanelScrollPrompt />
        <CollectivesDemotionPrompt />
        <CollectivesClaimPrompt />
      </NeutralPanel>
    </MemberDataProvider>
  );
}
