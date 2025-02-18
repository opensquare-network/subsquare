import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import MyEvidenceProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myEvidence";
import MyMemberDataProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myMemberData";
import MyMembershipReferendaProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myMembershipReferenda";
import CoreParamsProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";
import MembersProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/members";

export default function FellowshipTodoProviders({ children }) {
  const referendaPallet = useReferendaFellowshipPallet();

  return (
    <MembersProvider>
      <ActiveReferendaProvider pallet={referendaPallet}>
        <CoreParamsProvider>
          <MyEvidenceProvider>
            <MyMemberDataProvider>
              <MyMembershipReferendaProvider>
                {children}
              </MyMembershipReferendaProvider>
            </MyMemberDataProvider>
          </MyEvidenceProvider>
        </CoreParamsProvider>
      </ActiveReferendaProvider>
    </MembersProvider>
  );
}
