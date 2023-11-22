import useApi from "next-common/utils/hooks/useApi";
import useParamDefs from "./useParamDefs";
import Params from ".";

export default function TupleParam({ title, def, value, setValue }) {
  const api = useApi();
  const params = useParamDefs(api?.registry, def);

  return (
    <>
      {title}
      <Params params={params} value={value} setValue={setValue} />
    </>
  );
}
