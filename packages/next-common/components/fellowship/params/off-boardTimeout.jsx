import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { usePageProps } from "next-common/context/page";
import Period from "next-common/components/fellowship/params/period";

export default function FellowshipParamsOffBoardTimeoutCard() {
  const { fellowshipParams } = usePageProps();

  return (
    <SecondaryCard className="text-textPrimary flex justify-between">
      <div className="text14Bold">Off-board Timeout</div>
      <div className="text14Medium">
        <Period blocks={fellowshipParams?.offboardTimeout} />
      </div>
    </SecondaryCard>
  );
}
