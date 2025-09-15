import ListLayout from "next-common/components/layout/ListLayout";
import { usePageProps } from "next-common/context/page";
import CollectivesProvider from "next-common/context/collectives/collectives";
import FellowshipFeedsList from "next-common/components/feeds/list";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import useFeedsFilter from "../useFeedsFilter";

export default function FellowshipFeedsPage() {
  const title = "Fellowship Feeds";
  const seoInfo = { title };

  return (
    <ListLayout seoInfo={seoInfo} title={title}>
      <CollectivesProvider section="fellowship">
        <FellowshipFeedsImpl />
      </CollectivesProvider>
    </ListLayout>
  );
}

function FellowshipFeedsFilterImpl() {
  const { feeds } = usePageProps();
  const { component } = useFeedsFilter(feeds);
  return (
    <div className="flex items-center justify-between mb-4 mx-6">
      <div className="text16Bold">
        Feeds
        {!!feeds.total && (
          <span className="text-textTertiary text14Medium ml-1">
            {feeds.total}
          </span>
        )}
      </div>
      {component}
    </div>
  );
}

export function FellowshipFeedsImpl() {
  const { feeds } = usePageProps();

  return (
    <DropdownUrlFilterProvider
      shallow={false}
      defaultFilterValues={{
        who: null,
        event: null,
        section: null,
      }}
      emptyFilterValues={{
        page: 1,
        who: null,
        event: null,
        section: null,
      }}
    >
      <FellowshipFeedsFilterImpl />
      <FellowshipFeedsList feeds={feeds} />
    </DropdownUrlFilterProvider>
  );
}
