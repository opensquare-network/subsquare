import {
  TrackTreasury,
  TrackGovernance,
  TrackSystem,
  TrackFellowship,
  TrackOthers,
} from "@osn/icons/subsquare";

const trackPanelData = {
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
    categories: ["Staking Admin", "Auction Admin"],
    icon: <TrackOthers className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
};

export const trackCategoryMap = Object.fromEntries(
  Object.entries(trackPanelData).map(([key, value]) => [key, value.categories]),
);

export const categoryIconMap = Object.fromEntries(
  Object.entries(trackPanelData).map(([key, value]) => [key, value.icon]),
);
