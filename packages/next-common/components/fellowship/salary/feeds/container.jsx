import { FilterContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipSalaryFeedsList from "next-common/components/fellowship/salary/feeds/list";
import SearchBox from "next-common/components/preImages/searchBox";
import FilterButton from "next-common/components/filterButton";
import { useEffect, useState } from "react";
import useEventFilter from "next-common/hooks/fellowship/useEventFilter";
import { useRouter } from "next/router";
import { objectToQueryString } from "next-common/utils/url";

const EVENT_CONTENTS = {
  CycleStarted: "CycleStarted",
  Inducted: "Inducted",
  Registered: "Registered",
  Paid: "Paid",
};

export default function FellowshipSalaryFeedsContainer({ feeds = {} }) {
  const router = useRouter();
  const { who: queryWho, event: queryEvent } = router.query;
  const [searchValue, setSearchValue] = useState(queryWho || "");
  const [loading, setLoading] = useState(false);
  const { event, component } = useEventFilter(
    Object.values(EVENT_CONTENTS),
    queryEvent,
  );
  // TODO: core feeds, event filter options
  useEffect(() => {
    // Page loading completed
    setLoading(false);
  }, [router]);

  const onFilter = () => {
    const queryObject = {
      event,
      who: searchValue,
    };
    let query = objectToQueryString(queryObject);
    router.push({ pathname: router.pathname, query });
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

        {/* TODO: event filter */}
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
        <FellowshipSalaryFeedsList feeds={feeds} />
      </div>
    </>
  );
}
