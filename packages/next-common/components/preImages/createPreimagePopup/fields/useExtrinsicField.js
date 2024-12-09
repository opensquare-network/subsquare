import { useCallback, useState } from "react";
import Extrinsic from "next-common/components/extrinsic";
import { useContextApi } from "next-common/context/api";
import Loading from "next-common/components/loading";

export function useExtrinsicField({
  defaultSectionName = "system",
  defaultMethodName = "setCode",
}) {
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

  if (!api) {
    return {
      extrinsic,
      component: (
        <div className="flex justify-center">
          <Loading size={20} />
        </div>
      ),
    };
  }

  return {
    extrinsic,
    component: (
      <Extrinsic
        defaultSectionName={defaultSectionName}
        defaultMethodName={defaultMethodName}
        setValue={setValue}
      />
    ),
  };
}
