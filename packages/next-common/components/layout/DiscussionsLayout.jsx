import { useChainSettings } from "next-common/context/chain";
import ListLayout from "./ListLayout";

/**
 * @param {import("./ListLayout").ListLayoutProps} props
 */
export default function DiscussionsLayout(props) {
  const chainSettings = useChainSettings();

  const tabs = [
    {
      label: "Subsquare",
      url: "/discussions",
    },
    {
      label: "Polkassembly",
      url: "/polkassembly/discussions",
    },
  ];

  return (
    <ListLayout
      tabs={chainSettings.hasPolkassemblyDiscussions && tabs}
      {...props}
    />
  );
}
