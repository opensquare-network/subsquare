import { useCollectivesContext } from "next-common/context/collectives/collectives";
import {
  useAmbassadorMemberData,
  useFellowshipMemberData,
} from "../../context/memberDataContext";
import CollectivesSalaryGetPaymentWarning from "./getPayment";
import CollectivesSalaryRegisterWarning from "./register";

export default function CollectivesSalaryWarnings() {
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
      <CollectivesSalaryRegisterWarning
        section={section}
        memberData={memberData}
      />
      <CollectivesSalaryGetPaymentWarning
        section={section}
        memberData={memberData}
      />
    </>
  );
}
