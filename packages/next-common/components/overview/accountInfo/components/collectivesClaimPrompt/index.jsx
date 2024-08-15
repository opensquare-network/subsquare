import { useCollectivesContext } from "next-common/context/collectives/collectives";
import {
  useAmbassadorMemberData,
  useFellowshipMemberData,
} from "../../context/memberDataContext";
import CollectivesClaimGetPaymentPrompt from "./getPayment";
import CollectivesClaimRegisterPrompt from "./register";

export default function CollectivesClaimPrompt() {
  const { data: fellowshipMemberData, isLoading: fellowshipMemberLoading } =
    useFellowshipMemberData();
  const { data: ambassadorMemberData, isLoading: ambassadorMemberLoading } =
    useAmbassadorMemberData();

  const { section } = useCollectivesContext();

  let memberData;
  if (fellowshipMemberData) {
    memberData = fellowshipMemberData;
  } else if (ambassadorMemberData) {
    memberData = ambassadorMemberData;
  }

  if (!section || fellowshipMemberLoading || ambassadorMemberLoading) {
    return null;
  }

  return (
    <>
      <CollectivesClaimRegisterPrompt
        section={section}
        memberData={memberData}
      />
      <CollectivesClaimGetPaymentPrompt section={section} />
    </>
  );
}
