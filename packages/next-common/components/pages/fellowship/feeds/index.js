import ListLayout from "next-common/components/layout/ListLayout";
import { FilterContainer } from "next-common/components/styled/containers/titleContainer";
import { useState, useEffect } from "react";
import useEventFilter from "next-common/hooks/fellowship/useEventFilter";
import SearchBox from "next-common/components/preImages/searchBox";
import { useRouter } from "next/router";
import { objectToQueryString } from "next-common/utils/url";
import FilterButton from "next-common/components/filterButton";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import FellowshipCoreFeedsList from "next-common/components/fellowship/core/feeds/list";
import CollectivesProvider from "next-common/context/collectives/collectives";

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

const EVENT_CONTENTS = {
  ParamsChanged: "ParamsChanged",
  ActiveChanged: "ActiveChanged",
  Inducted: "Inducted",
  Offboarded: "Offboarded",
  Imported: "Imported",
  Promoted: "Promoted",
  Demoted: "Demoted",
  Proven: "Proven",
  Requested: "Requested",
  EvidenceJudged: "EvidenceJudged",
};

export function FellowshipFeedsImpl() {
  const { feeds } = usePageProps();
  const { section } = useCollectivesContext();
  const router = useRouter();
  const { who: queryWho, event: queryEvent } = router.query;
  const [searchValue, setSearchValue] = useState(queryWho || "");
  const [loading, setLoading] = useState(false);
  const { event, component } = useEventFilter(
    Object.values(EVENT_CONTENTS),
    queryEvent,
  );

  useEffect(() => {
    setLoading(false);
  }, [router]);

  const onFilter = () => {
    const queryObject = {
      event,
      who: searchValue,
    };
    let query = objectToQueryString(queryObject);
    router.push({ pathname: `/${section}/feeds`, query });
    setLoading(true);
  };

  return (
    <>
      <FilterContainer className="max-md:flex-col max-md:gap-2 md:flex-row md:items-center md:justify-between mb-4 pr-6">
        <div>
          Feeds
          {!!feeds.total && (
            <span className="text-textTertiary text14Medium ml-1">
              {feeds.total}
            </span>
          )}
        </div>

        <div className="flex max-md:flex-col md:flex-row md:items-center max-md:w-full gap-2">
          {component}
          <SearchBox
            value={searchValue}
            setValue={setSearchValue}
            placeholder={"Search address"}
          />
          <FilterButton
            className="max-md:w-full md:w-[67px]"
            loading={loading}
            size="small"
            onClick={onFilter}
          >
            Filter
          </FilterButton>
        </div>
      </FilterContainer>
      <div className="space-y-4 mt-4">
        <FellowshipCoreFeedsList feeds={feeds} />
      </div>
    </>
  );
}
