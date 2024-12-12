import styled from "styled-components";
import { useCallback, useState } from "react";
import Extrinsic from "next-common/components/extrinsic";
import { useContextApi } from "next-common/context/api";
import PopupLabel from "next-common/components/popup/label";

const Bar = styled.div`
  margin: 8px 0;
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    #f6f7fa 0%,
    rgba(246, 247, 250, 0.5) 49.5%,
    #f6f7fa 100%
  );
`;

export default function ExtrinsicLoading() {
  return (
    <div className="flex flex-col">
      <Bar className="w-[80px]"></Bar>
      <Bar className="w-full"></Bar>
      <Bar className="w-full"></Bar>
    </div>
  );
}

export function useExtrinsicField({
  label = "Propose",
  defaultSectionName = "system",
  defaultMethodName = "setCode",
} = {}) {
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
      component: <ExtrinsicLoading />,
    };
  }

  const component = (
    <div>
      <PopupLabel text={label} />
      <Extrinsic
        defaultSectionName={defaultSectionName}
        defaultMethodName={defaultMethodName}
        setValue={setValue}
      />
    </div>
  );

  return {
    extrinsic,
    component,
  };
}
