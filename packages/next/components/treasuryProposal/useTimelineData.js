import { useEffect, useState } from "react";
import { flatten } from "lodash-es";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { getTimelineStatus } from "../../utils";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { createMotionTimelineData } from "../../utils/timeline/motion";
import { createReferendumTimelineData } from "../../utils/timeline/referendum";
import sortTimeline from "next-common/utils/timeline/sort";
import SymbolBalance from "next-common/components/values/symbolBalance";
import AddressUser from "next-common/components/user/addressUser";

function getTimelineData(args, method) {
  switch (method) {
    case "Proposed":
      return {
        Index: `#${args.index}`,
      };
    case "Awarded":
      return {
        Beneficiary: <AddressUser add={args.beneficiary} />,
        Award: <SymbolBalance value={args.award} />,
      };
  }
  return args;
}

function getGov2ReferendumTimeline(timelineItem, treasuryProposal) {
  const indexer = timelineItem.extrinsicIndexer ?? timelineItem.indexer;

  return [
    {
      indexer,
      time: formatTime(indexer?.blockTime),
      status: {
        value: `Referenda #${treasuryProposal.gov2Referendum}`,
        link: `/referenda/${treasuryProposal.gov2Referendum}`,
      },
    },
    {
      indexer,
      time: formatTime(indexer?.blockTime),
      status: getTimelineStatus(
        detailPageCategory.TREASURY_PROPOSAL,
        "Approved",
      ),
    },
  ];
}

export default function useTreasuryTimelineData(treasuryProposal) {
  const [timelineData, setTimelineData] = useState([]);
  const motionLink = "/council/motions";

  useEffect(() => {
    const data = flatten(
      (treasuryProposal?.timeline || []).map((item) => {
        const indexer = item.extrinsicIndexer ?? item.indexer;

        const method = item.method ?? item.name;

        // Handle Gov2 created treasury proposal
        if (method === "SpendApproved" && treasuryProposal.isByGov2) {
          return getGov2ReferendumTimeline(item, treasuryProposal);
        }

        return {
          indexer,
          time: formatTime(indexer?.blockTime),
          status: getTimelineStatus(
            detailPageCategory.TREASURY_PROPOSAL,
            method,
          ),
          data: getTimelineData(item.args, item.method ?? item.name),
        };
      }),
    );

    const motions =
      treasuryProposal?.motions?.map((motion) => {
        return createMotionTimelineData(motion, true, motionLink);
      }) ?? [];

    const referendums =
      treasuryProposal?.referendums?.map((referendum) => {
        return createReferendumTimelineData(
          referendum,
          true,
          "/democracy/referenda",
        );
      }) ?? [];

    setTimelineData(sortTimeline([...data, ...motions, ...referendums]));
  }, [treasuryProposal, motionLink]);

  return timelineData;
}
