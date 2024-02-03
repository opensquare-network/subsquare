import { useChainSettings } from "next-common/context/chain";
import IconLinks from "../iconLinks";

export default function ChainSocialLinks({ className }) {
  const chainSettings = useChainSettings();
  return <IconLinks links={chainSettings.links} className={className} />;
}
