import { Fragment, useMemo } from "react";
import Link from "next/link";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { useActiveReferenda } from "next-common/context/activeReferenda";
import CoreFellowshipMemberInfoWrapper from "./infoWrapper";
import CoreFellowshipMemberInfoTitle from "./title";
import useFetch from "next-common/hooks/useFetch";
import Tooltip from "next-common/components/tooltip";
import { getGov2ReferendumTitle } from "next-common/utils/gov2/title";

function useRelatedReferenda(address, pallet) {
  const activeReferenda = useActiveReferenda();

  return useMemo(() => {
    return activeReferenda.filter(({ call }) => {
      if (!call) {
        return false;
      }

      const { section, method } = call;
      if (section !== pallet) {
        return false;
      }
      if (!["bump", "approve", "promote", "promoteFast"].includes(method)) {
        return false;
      }

      const nameArg = call.args.find(({ name }) => name === "who");
      return nameArg?.value === address;
    });
  }, [activeReferenda, address, pallet]);
}

function ReferendumTooltip({ referendumIndex, children }) {
  const { section } = useCollectivesContext();
  const { value } = useFetch(`/api/${section}/referenda/${referendumIndex}`);
  if (!value) {
    return children;
  }
  const title = getGov2ReferendumTitle(value);
  return (
    <Tooltip content={`#${referendumIndex} · ${title}`}>{children}</Tooltip>
  );
}

export function CoreFellowshipMemberRelatedReferendaContent({
  address,
  pallet,
}) {
  const relatedReferenda = useRelatedReferenda(address, pallet);
  const { section } = useCollectivesContext();

  if (relatedReferenda.length > 0) {
    return relatedReferenda.map(({ referendumIndex }, index) => (
      <Fragment key={index}>
        {index !== 0 && (
          <span className="text12Medium text-textTertiary">·</span>
        )}
        <ReferendumTooltip referendumIndex={referendumIndex}>
          <Link href={`/${section}/referenda/${referendumIndex}`}>
            <span className="cursor-pointer text-sapphire500 text12Medium">
              #{referendumIndex}
            </span>
          </Link>
        </ReferendumTooltip>
      </Fragment>
    ));
  }

  return <span className="text-textDisabled text12Medium">-</span>;
}

export default function CoreFellowshipMemberRelatedReferenda({
  address,
  pallet,
}) {
  return (
    <CoreFellowshipMemberInfoWrapper>
      <CoreFellowshipMemberInfoTitle className="mb-0.5">
        Referenda
      </CoreFellowshipMemberInfoTitle>
      <div className="flex text12Medium gap-[4px] items-center truncate">
        <CoreFellowshipMemberRelatedReferendaContent
          address={address}
          pallet={pallet}
        />
      </div>
    </CoreFellowshipMemberInfoWrapper>
  );
}
