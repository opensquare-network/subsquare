import Divider from "next-common/components/styled/layout/divider";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import CollectivesAccountInfo from "./components/collectiveAccountInfo";
import CollectivesDemotionPrompt from "./components/collectivesDemotionPrompt";
import { AccountHead, ProxyTip } from "./accountInfoPanel";
import AccountPanelScrollPrompt from "./components/accountPanelScrollPrompt";
import CollectivesSalaryWarnings from "./components/collectivesSalaryWarnings";
import useMemberData from "./hook/useMemberData";
import MemberDataProvider from "./context/memberDataContext";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { isNil } from "lodash-es";

export default function CollectivesAccountInfoPanel() {
  const fellowshipMemberData = useMemberData();
  const ambassadorMemberData = useMemberData("ambassador");
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return (
    <MemberDataProvider
      fellowshipMemberData={fellowshipMemberData}
      ambassadorMemberData={ambassadorMemberData}
    >
      <NeutralPanel className="p-6 space-y-4">
        <ProxyTip />
        <AccountHead width={width} />
        <Divider />

        <CollectivesAccountInfo />

        <AccountPanelScrollPrompt />
        <CollectivesDemotionPrompt />
        <CollectivesSalaryWarnings />
      </NeutralPanel>
    </MemberDataProvider>
  );
}
