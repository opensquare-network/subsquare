import useApi from "next-common/utils/hooks/useApi";
import useParamDefs from "./useParamDefs";
import Params from ".";

export default function StructParam({ def }) {
  const api = useApi();
  const params = useParamDefs(api?.registry, def);

  return <Params params={params} />;
}
