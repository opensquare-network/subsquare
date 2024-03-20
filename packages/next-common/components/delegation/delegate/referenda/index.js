import { useState } from "react";
import Delegates from "next-common/components/delegation/delegate/referenda/members";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import DelegationSortSelect from "../common/sortSelect";
import { useRouter } from "next/router";
import ReferendaDelegationSearchResult from "./searchResult";
import { useReferendaDelegatesContext } from "./useReferendaDelegatesContext";
import DelegatesLoadable from "../common/loadable";
import DelegateEmpty from "../common/empty";
import DelegationSearchInput from "../common/searchInput";
import NewDelegateButton from "next-common/components/summary/allDelegation/newDelegateButton";
import { SystemPlus } from "@osn/icons/subsquare";

export default function ReferendaDelegates() {
  const router = useRouter();

  const { referendaDelegatesPageData, pageComponent } =
    useReferendaDelegatesContext();
  const { items: delegates = [], total = 0 } = referendaDelegatesPageData || {};
  const [sort, setSort] = useState(router.query.sort || "");
  const [searchAddress, setSearchAddress] = useState("");

  return (
    <>
      <TitleContainer>
        <span>
          List
          {!!total && (
            <span className="text-textTertiary text14Medium ml-1">{total}</span>
          )}
        </span>

        <DelegationSortSelect sort={sort} setSort={setSort} />
      </TitleContainer>

      <div className="px-6">
        <DelegationSearchInput
          address={searchAddress}
          setAddress={setSearchAddress}
          delegateButton={
            <NewDelegateButton
              defaultTargetAddress={searchAddress}
              size="large"
              iconLeft={<SystemPlus />}
            />
          }
        />
      </div>

      {searchAddress ? (
        <ReferendaDelegationSearchResult searchAddress={searchAddress} />
      ) : (
        <DelegatesLoadable delegates={referendaDelegatesPageData}>
          {delegates <= 0 ? (
            <DelegateEmpty />
          ) : (
            <Delegates delegates={delegates} />
          )}

          <div className="mt-2">{pageComponent}</div>
        </DelegatesLoadable>
      )}
    </>
  );
}
