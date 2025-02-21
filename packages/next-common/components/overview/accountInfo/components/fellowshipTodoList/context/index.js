import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import MyEvidenceProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myEvidence";
import MyMembershipReferendaProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myMembershipReferenda";
import CoreParamsProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";
import CoreMembersProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreMembers";
import SalaryStatsProvider from "./salaryStats";
import MySalaryClaimantProvider from "./mySalaryClaimant";
import CollectivesMembersProvider from "./collectivesMember";

export default function FellowshipTodoProviders({ children }) {
  const referendaPallet = useReferendaFellowshipPallet();

  return (
    <ActiveReferendaProvider pallet={referendaPallet}>
      <CollectivesMembersProvider>
        <CoreMembersProvider>
          <CoreParamsProvider>
            <MyEvidenceProvider>
              <MyMembershipReferendaProvider>
                <SalaryStatsProvider>
                  <MySalaryClaimantProvider>
                    {children}
                  </MySalaryClaimantProvider>
                </SalaryStatsProvider>
              </MyMembershipReferendaProvider>
            </MyEvidenceProvider>
          </CoreParamsProvider>
        </CoreMembersProvider>
      </CollectivesMembersProvider>
    </ActiveReferendaProvider>
  );
}
