import { Fragment, useMemo } from "react";
import Link from "next/link";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { useActiveReferenda } from "next-common/context/activeReferenda";
import CoreFellowshipMemberInfoWrapper from "./infoWrapper";
import CoreFellowshipMemberInfoTitle from "./title";
import useFetch from "next-common/hooks/useFetch";
import Tooltip from "next-common/components/tooltip";

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
      if (!["bump", "approve", "promote"].includes(method)) {
        return false;
      }

      const nameArg = call.args.find(({ name }) => name === "who");
      if (!nameArg) {
        return false;
      }
      if (nameArg.value !== address) {
        return false;
      }

      return true;
    });
  }, [activeReferenda, address, pallet]);
}

function ReferendumTooltip({ referendumIndex, children }) {
  const { section } = useCollectivesContext();
  const { value } = useFetch(`/api/${section}/referenda/${referendumIndex}`);
  if (!value) {
    return children;
  }
  return (
    <Tooltip content={`#${referendumIndex} · ${value?.title}`}>
      {children}
    </Tooltip>
  );
}

export default function CoreFellowshipMemberRelatedReferenda({
  address,
  pallet,
}) {
  const relatedReferenda = useRelatedReferenda(address, pallet);
  const { section } = useCollectivesContext();

  let referendaList = <span className="text-textDisabled text12Medium">-</span>;
  if (relatedReferenda.length > 0) {
    referendaList = relatedReferenda.map(({ referendumIndex }, index) => (
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

  return (
    <CoreFellowshipMemberInfoWrapper>
      <CoreFellowshipMemberInfoTitle className="mb-0.5">
        Referenda
      </CoreFellowshipMemberInfoTitle>
      <div className="flex text12Medium gap-[4px] items-center truncate">
        {referendaList}
      </div>
    </CoreFellowshipMemberInfoWrapper>
  );
}
