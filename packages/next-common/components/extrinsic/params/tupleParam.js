import useParamDefs from "./useParamDefs";
import Params from ".";
import { useContextApi } from "next-common/context/api";

export default function TupleParam({ title, def, value, setValue }) {
  const api = useContextApi();
  const params = useParamDefs(api?.registry, def);

  return (
    <>
      {title}
      <Params params={params} value={value} setValue={setValue} />
    </>
  );
}
