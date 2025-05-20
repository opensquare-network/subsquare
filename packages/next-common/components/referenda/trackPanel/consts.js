import {
  TrackTreasury,
  TrackGovernance,
  TrackSystem,
  TrackFellowship,
  TrackOthers,
  TrackRetention,
  TrackPromotion,
  TrackFastPromotion,
} from "@osn/icons/subsquare";
import { listPageCategory } from "next-common/utils/consts/business/category";

const gov2TrackPanelData = {
  system: {
    categories: ["Root", "Wish For Change"],
    icon: <TrackSystem className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
  treasury: {
    categories: [
      "Treasurer",
      "Small Tipper",
      "Big Tipper",
      "Small Spender",
      "Medium Spender",
      "Big Spender",
      "Spender",
      "Tipper",
    ],
    icon: <TrackTreasury className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
  governance: {
    categories: [
      "Lease Admin",
      "General Admin",
      "Referendum Canceller",
      "Referendum Killer",
    ],
    icon: <TrackGovernance className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
  fellowship: {
    categories: ["Whitelisted Caller", "Fellowship Admin"],
    icon: <TrackFellowship className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
  others: {
    categories: [],
    icon: <TrackOthers className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
};

const fellowShipTrackPanelData = {
  members: {
    categories: [
      "Members",
      "Proficient Members",
      "Fellows",
      "Architects",
      "Architects Adept",
      "Grand Architects",
      "Masters",
      "Masters Constant",
      "Grand Masters",
    ],
    icon: <TrackFellowship className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
  retention: {
    categories: [
      "Retain At I Dan",
      "Retain At Ii Dan",
      "Retain At Iii Dan",
      "Retain At Iv Dan",
      "Retain At V Dan",
      "Retain At Vi Dan",
    ],
    icon: <TrackRetention className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
  promotion: {
    categories: [
      "Promote To I Dan",
      "Promote To Ii Dan",
      "Promote To Iii Dan",
      "Promote To Iv Dan",
      "Promote To V Dan",
      "Promote To Vi Dan",
    ],
    icon: <TrackPromotion className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
  fast_promotion: {
    categories: [
      "Fast Promote To I Dan",
      "Fast Promote To Ii Dan",
      "Fast Promote To Iii Dan",
    ],
    icon: (
      <TrackFastPromotion className="w-6 h-6 [&_path]:fill-textSecondary" />
    ),
  },
};

const trackPanelData = {
  [listPageCategory.REFERENDA]: gov2TrackPanelData,
  [listPageCategory.FELLOWSHIP_REFERENDA]: fellowShipTrackPanelData,
};

export const gov2TrackCategoryMap = Object.fromEntries(
  Object.entries(trackPanelData[listPageCategory.REFERENDA]).map(
    ([key, value]) => [key, value.categories],
  ),
);

export const gov2CategoryIconMap = Object.fromEntries(
  Object.entries(trackPanelData[listPageCategory.REFERENDA]).map(
    ([key, value]) => [key, value.icon],
  ),
);

export const fellowshipTrackCategoryMap = Object.fromEntries(
  Object.entries(trackPanelData[listPageCategory.FELLOWSHIP_REFERENDA]).map(
    ([key, value]) => [key, value.categories],
  ),
);

export const fellowshipCategoryIconMap = Object.fromEntries(
  Object.entries(trackPanelData[listPageCategory.FELLOWSHIP_REFERENDA]).map(
    ([key, value]) => [key, value.icon],
  ),
);

export const gov2InitialObj = {
  system: [],
  treasury: [],
  governance: [],
  fellowship: [],
  others: [],
};

export const fellowshipInitialObj = {
  members: [],
  retention: [],
  promotion: [],
  fast_promotion: [],
};

export const otherCategoryMaxCount = 10;
