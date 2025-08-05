import OnchainEvidence from "next-common/components/pages/fellowship/member/fellowshipMember/onchainEvidence";
import useProfileAddress from "../useProfileAddress";
import AddressProvider from "next-common/context/address";

export default function ProfileFellowshipEvidence({ section }) {
  const who = useProfileAddress();
  if (section === "fellowship") {
    return (
      <AddressProvider address={who}>
        <OnchainEvidence />
      </AddressProvider>
    );
  }
  return null;
}
