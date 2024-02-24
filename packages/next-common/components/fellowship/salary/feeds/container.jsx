import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipSalaryFeedsList from "next-common/components/fellowship/salary/feeds/list";

export default function FellowshipSalaryFeedsContainer({ feeds = {} }) {
  return (
    <>
      <TitleContainer>
        <span>Feeds</span>
      </TitleContainer>

      <div className="space-y-4 mt-4">
        <FellowshipSalaryFeedsList feeds={feeds} />
      </div>
    </>
  );
}
