import { isNil } from "lodash-es";
import nextApi from "next-common/services/nextApi";
import { ambassadorSalaryCycleApi } from "next-common/services/url";
import { useEffect, useState } from "react";

export function useAmbassadorSalaryCycleData(index) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isNil(index)) {
      return;
    }

    nextApi.fetch(ambassadorSalaryCycleApi(index)).then((resp) => {
      setData(resp.result);
    });
  }, [index]);

  return data;
}
