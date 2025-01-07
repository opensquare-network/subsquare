import { Fragment } from "react";
import Link from "next/link";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import CoreFellowshipMemberInfoWrapper from "./infoWrapper";
import CoreFellowshipMemberInfoTitle from "./title";
import useFetch from "next-common/hooks/useFetch";
import Tooltip from "next-common/components/tooltip";
import { getGov2ReferendumTitle } from "next-common/utils/gov2/title";
import useRelatedReferenda from "next-common/hooks/fellowship/useRelatedReferenda";
import FieldLoading from "next-common/components/icons/fieldLoading";

const methods = ["bump", "approve", "promote", "promoteFast"];

export function useFellowshipCoreRelatedReferenda(address) {
  return useRelatedReferenda(address, methods);
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
  relatedReferenda,
  isLoading,
}) {
  const { section } = useCollectivesContext();

  if (isLoading) {
    return <FieldLoading size={16} />;
  }

  if (relatedReferenda.length > 0) {
    return relatedReferenda.map(({ referendumIndex }, index) => (
      <Fragment key={index}>
        {index !== 0 && <span className="text-textTertiary">·</span>}
        <ReferendumTooltip referendumIndex={referendumIndex}>
          <Link href={`/${section}/referenda/${referendumIndex}`}>
            <span className="cursor-pointer text-sapphire500">
              #{referendumIndex}
            </span>
          </Link>
        </ReferendumTooltip>
      </Fragment>
    ));
  }

  return <span className="text-textDisabled">-</span>;
}

export default function CoreFellowshipMemberRelatedReferenda({
  address,
  pallet,
}) {
  const { relatedReferenda, isLoading } = useFellowshipCoreRelatedReferenda(
    address,
    pallet,
  );

  return (
    <CoreFellowshipMemberInfoWrapper>
      <CoreFellowshipMemberInfoTitle className="mb-0.5">
        Referenda
      </CoreFellowshipMemberInfoTitle>
      <div className="flex text12Medium gap-[4px] items-center truncate">
        <CoreFellowshipMemberRelatedReferendaContent
          relatedReferenda={relatedReferenda}
          isLoading={isLoading}
        />
      </div>
    </CoreFellowshipMemberInfoWrapper>
  );
}
