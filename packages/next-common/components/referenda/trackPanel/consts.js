import { MenuTracks } from "@osn/icons/subsquare";

const trackPanelData = {
  treasury: {
    categories: [
      "Treasurer",
      "Small Tipper",
      "Big Tipper",
      "Small Spender",
      "Medium Spender",
      "Big Spender",
    ],
    icon: <MenuTracks className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
  governance: {
    categories: [
      "Lease Admin",
      "General Admin",
      "Referendum Canceller",
      "Referendum Killer",
    ],
    icon: <MenuTracks className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
  main_agenda: {
    categories: ["Root", "Wish For Change"],
    icon: <MenuTracks className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
  fellowship: {
    categories: ["Whitelisted Caller", "Fellowship Admin"],
    icon: <MenuTracks className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
  others: {
    categories: ["Staking Admin", "Auction Admin"],
    icon: <MenuTracks className="w-6 h-6 [&_path]:fill-textSecondary" />,
  },
};

export const trackCategoryMap = Object.fromEntries(
  Object.entries(trackPanelData).map(([key, value]) => [key, value.categories]),
);

//TODO：There is no corresponding icon for the moment. Use the menu track to mock first
export const categoryIconMap = Object.fromEntries(
  Object.entries(trackPanelData).map(([key, value]) => [key, value.icon]),
);
