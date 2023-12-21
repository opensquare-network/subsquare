import isNil from "lodash.isnil";
import Gov2TrackTag from "next-common/components/gov2/trackTag";
import ListPostTitle from "next-common/components/postList/postTitle";
import PostListCardVotesSummaryBar from "next-common/components/postList/votesSummaryBar";
import Flex from "next-common/components/styled/flex";
import Tag from "next-common/components/tags/state/tag";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import Link from "next/link";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import businessCategory from "next-common/utils/consts/business/category";
import { getMotionStateArgs } from "next-common/utils/collective/result";

export function getReferendumPostTitleColumn() {
  return {
    name: "Referendum",
    className: "text-left",
    cellRender(data) {
      return (
        <ListPostTitle
          className="line-clamp-1 mr-4 text14Medium"
          data={data}
          href={data.detailLink}
          ellipsis
        />
      );
    },
  };
}
export function getProposalPostTitleColumn() {
  return {
    ...getReferendumPostTitleColumn(),
    name: "Proposal",
  };
}

export function getVoteSummaryColumn(props) {
  return {
    name: "",
    className: "w-6",
    cellRender(data) {
      const hasTally = data.onchainData?.tally || data.onchainData?.info?.tally;
      return (
        hasTally && (
          <Flex>
            <PostListCardVotesSummaryBar data={data} {...props} />
          </Flex>
        )
      );
    },
  };
}

export function getStatusTagColumn(props) {
  return {
    name: "Status",
    className: "text-right w-[120px]",
    cellRender(data) {
      const { category } = props || {};
      let args, stateName;
      if (
        [
          businessCategory.fellowship,
          businessCategory.openGovReferenda,
        ].includes(category)
      ) {
        stateName = data.state?.state || data?.state?.name;
        args = getGov2ReferendumStateArgs(data?.state);
      } else if (
        [
          businessCategory.councilMotions,
          businessCategory.tcProposals,
          businessCategory.advisoryMotions,
          businessCategory.allianceMotions,
          businessCategory.financialMotions,
          businessCategory.treasuryCouncilMotions,
          businessCategory.openTechCommitteeProposals,
          businessCategory.collective,
        ].includes(category)
      ) {
        args = getMotionStateArgs(data?.state);
      }

      return (
        data.status && (
          <Tag state={stateName || data.status} args={args} {...props} />
        )
      );
    },
  };
}

export function getTrackColumn({ hrefPrefix = "", ...props }) {
  return {
    name: "Track",
    className: "w-40 text-left",
    cellRender(data) {
      return (
        <Link
          className="inline-flex"
          href={`${hrefPrefix}/${data.track}`}
          {...props}
        >
          <Gov2TrackTag name={data.trackName} />
        </Link>
      );
    },
  };
}

export function getRequestColumn() {
  return {
    name: "Request",
    className: "w-40 text-left",
    cellRender(data) {
      const { decimals, symbol } = getChainSettings(CHAIN);
      const postValue = data.onchainData?.isTreasury
        ? data.onchainData?.treasuryInfo?.amount
        : data.value;

      return !isNil(postValue) ? (
        <ValueDisplay
          className="text14Medium text-textPrimary"
          value={toPrecision(postValue, decimals)}
          symbol={symbol}
        />
      ) : (
        "--"
      );
    },
  };
}
