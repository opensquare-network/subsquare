import Divider from "next-common/components/styled/layout/divider";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import CollectivesAccountInfo from "./components/collectiveAccountInfo";
import { AccountHead, ProxyTip } from "./accountInfoPanel";
import AccountPanelScrollPrompt from "./components/accountPanelScrollPrompt";
import ExtensionUpdatePrompt from "./components/extensionUpdatePrompt";
import CollectivesSalaryWarnings from "./components/collectivesSalaryWarnings";
import useMemberData from "./hook/useMemberData";
import MemberDataProvider from "./context/memberDataContext";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { isNil } from "lodash-es";
import FellowshipTodoList from "./components/fellowshipTodoList";

export default function CollectivesAccountInfoPanel() {
  const fellowshipMemberData = useMemberData("fellowship");
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
        <Divider />
        <FellowshipTodoList />

        <ExtensionUpdatePrompt />
        <AccountPanelScrollPrompt />
        <CollectivesSalaryWarnings />
      </NeutralPanel>
    </MemberDataProvider>
  );
}
