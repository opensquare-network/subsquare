export const nodes = [
  {
    value: "kusama",
    name: "Kusama",
    icon: "kusama.svg",
  },
  {
    value: "polkadot",
    name: "Polkadot",
    icon: "polkadot.svg",
  },
];

export const accountMenu = [
  {
    value: "notifications",
    name: "Notifications",
    icon: "notifications.svg",
  },
  {
    value: "settings",
    name: "Settings",
    icon: "settings.svg",
  },
  {
    value: "logout",
    name: "Logout",
    icon: "logout.svg",
  },
];

export const menu = [
  {
    items: [
      {
        value: "overview",
        name: "Overview",
        icon: "type-overview.svg",
        pathname: "/",
      },
      {
        value: "discussions",
        name: "Discussions",
        icon: "type-discussions.svg",
        pathname: "/discussions",
      },
    ],
  },
  {
    name: "ON-CHAIN",
    items: [
      {
        value: "activity",
        name: "On-chain Activity",
        icon: "type-overview.svg",
      },
      {
        value: "referenda",
        name: "Referenda",
        icon: "type-referenda.svg",
      },
      {
        value: "proposals",
        name: "Proposals",
        icon: "type-proposals.svg",
      },
      {
        value: "motions",
        name: "Motions",
        icon: "type-motions.svg",
      },
      {
        value: "treasuryProposals",
        name: "Treasury Proposals",
        icon: "type-treasury-proposals.svg",
      },
      {
        value: "tips",
        name: "Tips",
        icon: "type-tips.svg",
      },
      {
        value: "bounties",
        name: "Bounties",
        icon: "type-bounties.svg",
      },
      {
        value: "techCommProposals",
        name: "Tech Comm Proposals",
        icon: "type-tech-comm-proposals.svg",
      },
    ],
  },
  {
    name: "SETTING",
    items: [
      {
        value: "account",
        name: "Account",
        icon: "setting-account.svg",
        pathname: "/setting/account",
      },
      {
        value: "linked-address",
        name: "Linked Address",
        icon: "setting-linked-address.svg",
        pathname: "/setting/linked-address",
      },
      {
        value: "notification",
        name: "Notification",
        icon: "setting-notification.svg",
        pathname: "/setting/notification",
      },
    ],
  },
];
