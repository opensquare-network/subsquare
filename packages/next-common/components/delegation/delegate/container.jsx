import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import {
  ModuleTab,
  ModuleTabProvider,
} from "next-common/components/profile/votingHistory/common";
import useDelegationModuleTabs from "next-common/components/delegation/delegate/useModuleTabs";
import DelegatesSection from "next-common/components/delegation/delegate/delegatesSection";
import MyDelegationSection from "./myDelegationSection";

export default function DelegateContainer() {
  const { moduleTabs, defaultModuleTab } = useDelegationModuleTabs();

  return (
    <ModuleTabProvider availableTabs={moduleTabs} defaultTab={defaultModuleTab}>
      <div className="flex flex-col gap-y-4">
        <TitleContainer>
          <span>Delegates</span>
          <ModuleTab />
        </TitleContainer>

        <MyDelegationSection />

        <DelegatesSection />
      </div>
    </ModuleTabProvider>
  );
}
