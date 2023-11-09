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

export function getReferendumPostTitleColumn() {
  return {
    name: "Referendum",
    className: "text-left",
    cellRender(data) {
      return (
        <ListPostTitle
          className="line-clamp-1"
          data={data}
          href={data.detailLink}
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
      return data.status && <Tag state={data.status} data={data} {...props} />;
    },
  };
}

export function getTrackColumn({ hrefPrefix = "", ...props }) {
  return {
    name: "Track",
    className: "w-40 text-left",
    cellRender(data) {
      return (
        <Link href={`${hrefPrefix}/${data.track}`} {...props}>
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
          className="text14Medium"
          value={toPrecision(postValue, decimals)}
          symbol={symbol}
        />
      ) : (
        "--"
      );
    },
  };
}
