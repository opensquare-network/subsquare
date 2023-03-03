import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";

export default function TreasuryBountyCanceledContent({ bountyIndex, data }) {
  return (
    <>
      <IndexItem index={bountyIndex} />
      <DescriptionItem description={data.description} />
    </>
  );
}
