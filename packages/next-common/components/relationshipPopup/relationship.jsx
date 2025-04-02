import {
  Background,
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import UserNode from "./userNode";
import StatusEdge from "./statusEdge";
import { arrowMarker } from "next-common/components/relationshipPopup/arrowMarker";
import styled from "styled-components";
import { calculateNodePositionsHorizontal } from "next-common/utils/calculateNodePositionsHorizontal";

const nodeTypes = {
  user: UserNode,
};

const edgeTypes = {
  statusedge: StatusEdge,
};

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

export default function Relationship({
  nodes: initialNodes,
  edges: initialEdges,
}) {
  const calculatedNodes = calculateNodePositionsHorizontal(
    initialNodes,
    initialEdges,
  );
  const [nodes] = useNodesState(calculatedNodes);
  const [edges] = useEdgesState(initialEdges);
  return (
    <div className="h-[512px] border border-neutral300 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        style={{ backgroundColor: "var(--neutral200)" }}
      >
        <Background />
        <ControlsStyled position="bottom-right" showInteractive={false} />
        {arrowMarker}
      </ReactFlow>
    </div>
  );
}
