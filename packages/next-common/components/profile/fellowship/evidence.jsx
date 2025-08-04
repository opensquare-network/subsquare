import OnchainEvidence from "next-common/components/pages/fellowship/member/fellowshipMember/onchainEvidence";

export default function ProfileFellowshipEvidence({ section }) {
  if (section === "fellowship") {
    return <OnchainEvidence />;
  }
  return null;
}
