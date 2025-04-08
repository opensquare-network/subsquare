import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import MyMembershipReferendaProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myMembershipReferenda";
import CoreParamsProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";
import CoreMembersProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreMembers";
import SalaryStatsProvider from "./salaryStats";
import MySalaryClaimantProvider from "./mySalaryClaimant";
import CollectivesMembersProvider from "./collectivesMember";
import CollectivesReferendaVotesProvider from "./collectivesVotes";
import { AllMemberEvidenceProvider } from "next-common/components/collectives/core/context/evidenceMemberContext";
import { ReferendaTitleProvider } from "next-common/components/pages/fellowship/member/fellowshipMember/heatmap";

export default function FellowshipTodoProviders({ children }) {
  const referendaPallet = useReferendaFellowshipPallet();

  return (
    <ReferendaTitleProvider>
      <ActiveReferendaProvider pallet={referendaPallet}>
        <CollectivesMembersProvider>
          <CoreMembersProvider>
            <CoreParamsProvider>
              <AllMemberEvidenceProvider>
                <MyMembershipReferendaProvider>
                  <SalaryStatsProvider>
                    <MySalaryClaimantProvider>
                      <CollectivesReferendaVotesProvider>
                        {children}
                      </CollectivesReferendaVotesProvider>
                    </MySalaryClaimantProvider>
                  </SalaryStatsProvider>
                </MyMembershipReferendaProvider>
              </AllMemberEvidenceProvider>
            </CoreParamsProvider>
          </CoreMembersProvider>
        </CollectivesMembersProvider>
      </ActiveReferendaProvider>
    </ReferendaTitleProvider>
  );
}
