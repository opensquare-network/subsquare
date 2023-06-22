import { useChain } from "../context/chain";
import capitalize from "lodash.capitalize";

export default function usePageTitle(suffix = "") {
  const chain = useChain();
  return `${ capitalize(chain) } ${ suffix }`;
}
