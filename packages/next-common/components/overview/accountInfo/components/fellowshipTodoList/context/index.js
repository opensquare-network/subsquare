import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import MyEvidenceProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myEvidence";
import MyMembershipReferendaProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myMembershipReferenda";
import CoreParamsProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";
import CoreMembersProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreMembers";
import SalaryStatsProvider from "./salaryStats";
import MySalaryClaimantProvider from "./mySalaryClaimant";
import CollectivesMemberProvider from "next-common/context/collectives/member";

export default function FellowshipTodoProviders({ children }) {
  const referendaPallet = useReferendaFellowshipPallet();

  return (
    <CoreMembersProvider>
      <ActiveReferendaProvider pallet={referendaPallet}>
        <CoreParamsProvider>
          <CollectivesMemberProvider>
            <SalaryStatsProvider>
              <MySalaryClaimantProvider>
                <MyEvidenceProvider>
                  <MyMembershipReferendaProvider>
                    {children}
                  </MyMembershipReferendaProvider>
                </MyEvidenceProvider>
              </MySalaryClaimantProvider>
            </SalaryStatsProvider>
          </CollectivesMemberProvider>
        </CoreParamsProvider>
      </ActiveReferendaProvider>
    </CoreMembersProvider>
  );
}
