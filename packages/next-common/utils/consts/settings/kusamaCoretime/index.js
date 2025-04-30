import dynamic from "next/dynamic";
import Chains from "../../chains";
import kusamaCommonCfg from "next-common/utils/consts/settings/kusama/common";
import kusamaCoretimeNodes from "next-common/utils/consts/settings/kusamaCoretime/endpoints";

const ProjectIconKusamaCoretime = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconKusamaCoretime"),
);

const kusamaCoretime = {
  ...kusamaCommonCfg,
  value: Chains.kusamaCoretime,
  name: "Coretime",
  description:
    "A revolutionary approach to accessing the right amount of blockspace for every stage of growth.",
  avatar: ProjectIconKusamaCoretime,
  darkAvatar: ProjectIconKusamaCoretime,
  endpoints: kusamaCoretimeNodes,
  integrations: {
    subscan: {
      domain: "coretime-kusama",
    },
  },
  multisigWallets: {
    mimir: true,
  },
};

export default kusamaCoretime;
