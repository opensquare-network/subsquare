import { getReferendaMenu } from "next-common/utils/consts/menu/referenda";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import businessCategory from "next-common/utils/consts/business/category";
import {
  getReferendumPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumn,
} from "./common";
import Gov2TrackTag from "next-common/components/gov2/trackTag";
import Link from "next/link";
import isNil from "lodash.isnil";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import getChainSettings from "next-common/utils/consts/settings";
import { CHAIN } from "next-common/utils/constants";

const trackColumn = {
  name: "Track",
  className: "w-40 text-left",
  cellRender(data) {
    return (
      <Link href={`/referenda/tracks/${data.track}`}>
        <Gov2TrackTag name={data.trackName} />
      </Link>
    );
  },
};

const requestColumn = {
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

function getColumns(item) {
  const track = item.value;

  return [
    getReferendumPostTitleColumn(),
    track === "all" && trackColumn,
    track !== "all" && requestColumn,
    getVoteSummaryColumn({ type: businessCategory.openGovReferenda }),
    getStatusTagColumn({ category: businessCategory.openGovReferenda }),
  ].filter(Boolean);
}

export function getActiveProposalReferenda({ tracks }) {
  const menu = getReferendaMenu(tracks);

  const items = menu.items?.map((item) => {
    const track = item.value;

    const params = {};
    if (track !== "all") {
      params.track = track;
    }

    return {
      ...item,
      api: {
        path: "overview/referenda",
        params,
      },
      formatter: (data) => normalizeGov2ReferendaListItem(data, tracks),
      columns: getColumns(item),
    };
  });

  return {
    ...menu,
    items,
  };
}
