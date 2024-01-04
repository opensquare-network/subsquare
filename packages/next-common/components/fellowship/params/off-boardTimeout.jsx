import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { usePageProps } from "next-common/context/page";

export default function FellowshipOffBoardTimeoutCard() {
  const props = usePageProps();
  console.log(props);

  return (
    <SecondaryCard className="text-textPrimary flex justify-between">
      <div className="text14Bold">Off-board Timeout</div>
      {/* <div className="text14Medium">{fellowshipParams.offboardTimeout}</div> */}
    </SecondaryCard>
  );
}
