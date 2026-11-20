import dynamic from "next/dynamic";

const ProjectIconPolkadotBulletin = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotBulletin"),
);

export default {
  name: "Bulletin",
  avatar: ProjectIconPolkadotBulletin,
  darkAvatar: ProjectIconPolkadotBulletin,
  endpoints: [
    {
      name: "Parity",
      url: "wss://bulletin-rpc.polkadot.io",
    },
    {
      name: "LuckyFriday",
      url: "wss://rpc-bulletin.luckyfriday.io",
    },
  ],
};
