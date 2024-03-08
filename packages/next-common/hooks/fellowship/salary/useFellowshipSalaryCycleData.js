import isNil from "lodash.isnil";
import nextApi from "next-common/services/nextApi";
import { fellowshipSalaryCycleApi } from "next-common/services/url";
import { useEffect, useState } from "react";

export function useFellowshipSalaryCycleData(index) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isNil(index)) {
      return;
    }

    nextApi.fetch(fellowshipSalaryCycleApi(index)).then((resp) => {
      setData(resp.result);
    });
  }, [index]);

  return data;
}
