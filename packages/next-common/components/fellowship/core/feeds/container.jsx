import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipCoreFeedsList from "./list";

export default function FellowshipCoreFeedsContainer({ feeds = {} }) {
  return (
    <>
      <TitleContainer>
        <span>
          Feeds
          {!!feeds.total && (
            <span className="text-textTertiary text14Medium ml-1">
              {feeds.total}
            </span>
          )}
        </span>
      </TitleContainer>
      <div className="space-y-4 mt-4">
        <FellowshipCoreFeedsList feeds={feeds} />
      </div>
    </>
  );
}
