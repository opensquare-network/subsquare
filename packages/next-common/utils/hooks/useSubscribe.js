import { useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubscribe(pallet, storage, params = []) {
  const [value, setValue] = useState();
  const { loading } = useSubStorage(pallet, storage, params, (rawOptional) => {
    setValue(rawOptional);
  });
  return { value, loading };
}
