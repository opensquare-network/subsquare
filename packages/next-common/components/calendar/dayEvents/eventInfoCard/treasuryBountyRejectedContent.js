import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";

export default function TreasuryBountyRejectedContent({ bountyIndex, data }) {
  return (
    <>
      <IndexItem index={bountyIndex} />
      <ProposerItem proposer={data.proposer} />
      <DescriptionItem description={data.description} />
    </>
  );
}
