import React, { useEffect, useState } from "react";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemMenu } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useChildBountiesWithPage from "./hooks/useChildBountiesWithPage";

const BountyDetailPopup = dynamicPopup(() => import("./bountyDetailPopup"), {
  ssr: false,
});

function CardChildBounties({ bountyIndex, item }) {
  const {
    isLoading,
    childBountiesPageData: childBounties,
    fetchChildBountiesWithPage,
  } = useChildBountiesWithPage(item?.bountyIndex);

  useEffect(() => {
    if (item) {
      fetchChildBountiesWithPage(1, 1);
    }
  }, [fetchChildBountiesWithPage, item]);

  const [isOpen, setIsOpen] = useState(false);

  if (isNil(childBounties) || isNil(bountyIndex) || isNil(item)) {
    return null;
  }

  const total = childBounties?.total ?? 0;
  const disabled = total === 0;

  return (
    <span className="mt-4 flex items-center">
      <GreyPanel className="flex-1 h-7 leading-7 px-3 text-textTertiary text12Medium flex items-center">
        Child Bounties&nbsp;
        <LoadableContent isLoading={isLoading}>
          <span className="text12Medium text-textSecondary">{total}</span>
        </LoadableContent>
      </GreyPanel>
      <SecondaryButton
        disabled={disabled}
        size="small"
        className="ml-2 p-0 h-7 w-7"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <SystemMenu className={"w-4 h-4"} />
      </SecondaryButton>
      {isOpen && (
        <BountyDetailPopup
          childBounties={childBounties}
          bountyIndex={bountyIndex}
          item={item}
          onClose={() => setIsOpen(false)}
        />
      )}
    </span>
  );
}

export default React.memo(CardChildBounties);
