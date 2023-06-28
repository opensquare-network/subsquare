import { useChain } from "../context/chain";
import capitalize from "lodash.capitalize";

/**
 * @description Return page title with chain name.
 */
export default function usePageTitle(suffix = "") {
  const chain = useChain();
  return `${capitalize(chain)} ${suffix}`;
}
