import { SystemPageNotFound } from "@osn/icons/subsquare";
import NoData from "next-common/components/noData";
import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";

export default function FellowshipSalaryCycleDetailNotFound() {
  return (
    <PrimaryCard>
      <NoData
        className="max-w-[336px] mx-auto"
        icon={<SystemPageNotFound className="[&_path]:fill-textTertiary" />}
        head="Cycle Not Found"
        text="Sorry, we can not find the cycle on the chain. Please contact us if you have any problems."
      />
    </PrimaryCard>
  );
}
