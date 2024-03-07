import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import {
  ModuleTab,
  ModuleTabProvider,
} from "next-common/components/profile/votingHistory/common";
import DelegateList from "next-common/components/delegation/delegate/list";
import useDelegationModuleTabs from "next-common/components/delegation/delegate/useModuleTabs";

export default function DelegateContainer() {
  const { moduleTabs, defaultModuleTab } = useDelegationModuleTabs();

  return (
    <ModuleTabProvider availableTabs={moduleTabs} defaultTab={defaultModuleTab}>
      <TitleContainer>
        <span>Delegates</span>
        <ModuleTab />
      </TitleContainer>
      <DelegateList />
    </ModuleTabProvider>
  );
}
