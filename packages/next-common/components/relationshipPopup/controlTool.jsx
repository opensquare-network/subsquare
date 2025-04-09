import { useReactFlow, Controls, ControlButton } from "@xyflow/react";
import dynamic from "next/dynamic";
import styled from "styled-components";

const SystemFocus = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.SystemFocus),
);

const ControlsStyled = styled(Controls)`
  row-gap: 8px;
  box-shadow: none;
  button {
    border-radius: 6px;
    background-color: var(--neutral100);
    border: 1px solid var(--neutral400);
    box-shadow: var(--shadow100);
    color: var(--textPrimary);
    width: 32px;
    height: 32px;
    padding: 0;
  }
`;

export default function ControlTool() {
  const reactFlow = useReactFlow();
  return (
    <ControlsStyled
      position="bottom-right"
      showInteractive={false}
      showFitView={false}
    >
      <ControlButton
        onClick={() => {
          reactFlow.fitView();
        }}
      >
        <SystemFocus className="text-textPrimary !max-w-[20px] !max-h-[20px]" />
      </ControlButton>
    </ControlsStyled>
  );
}
