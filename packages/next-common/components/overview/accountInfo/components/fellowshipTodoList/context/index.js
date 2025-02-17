import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import MyEvidenceProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myEvidence";
import MyMemberDataProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myMemberData";
import DemotionExpirationCountProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/demotionExpirationCount";
import MyMembershipReferendaProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myMembershipReferenda";
import CoreParamsProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";

export default function FellowshipTodoProviders({ children }) {
  const referendaPallet = useReferendaFellowshipPallet();

  return (
    <ActiveReferendaProvider pallet={referendaPallet}>
      <CoreParamsProvider>
        <MyEvidenceProvider>
          <MyMemberDataProvider>
            <DemotionExpirationCountProvider>
              <MyMembershipReferendaProvider>
                {children}
              </MyMembershipReferendaProvider>
            </DemotionExpirationCountProvider>
          </MyMemberDataProvider>
        </MyEvidenceProvider>
      </CoreParamsProvider>
    </ActiveReferendaProvider>
  );
}
