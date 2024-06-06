import { useChainSettings } from "../context/chain";
import { capitalize } from "lodash-es";

/**
 * @description Return page title with chain name.
 */
export default function usePageTitle(suffix = "") {
  const { name } = useChainSettings();
  return `${capitalize(name)} ${suffix}`;
}
