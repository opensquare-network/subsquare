import OnchainEvidence from "next-common/components/pages/fellowship/member/fellowshipMember/onchainEvidence";
import useProfileAddress from "../useProfileAddress";
import AddressProvider from "next-common/context/address";

export default function ProfileFellowshipEvidence({ section }) {
  const address = useProfileAddress();
  if (section === "fellowship") {
    return (
      <AddressProvider address={address}>
        <OnchainEvidence />
      </AddressProvider>
    );
  }
  return null;
}
