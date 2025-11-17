import { isPolkadotChain } from "next-common/utils/chain";
import { CHAIN } from "next-common/utils/constants";

const panelTabs = isPolkadotChain(CHAIN)
  ? [
      {
        value: "status",
        label: "Status",
        url: "/treasury",
      },
      {
        value: "projects",
        label: "Projects",
        url: "/treasury/projects",
      },
    ]
  : null;

export default panelTabs;
