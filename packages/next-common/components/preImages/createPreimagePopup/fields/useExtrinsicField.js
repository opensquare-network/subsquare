import { useCallback, useState } from "react";
import Extrinsic from "next-common/components/extrinsic";
import { useContextApi } from "next-common/context/api";

export function useExtrinsicField() {
  const api = useContextApi();

  const [extrinsic, setExtrinsic] = useState(null);

  const setValue = useCallback(
    ({ isValid, data }) => {
      if (!api || !isValid) {
        setExtrinsic(null);
        return;
      }

      if (data) {
        setExtrinsic(data);
      }
    },
    [api],
  );

  return {
    extrinsic,
    component: (
      <Extrinsic
        defaultSectionName="system"
        defaultMethodName="setCode"
        setValue={setValue}
      />
    ),
  };
}
