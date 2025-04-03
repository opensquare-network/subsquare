import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import UserNode from "./userNode";
import StatusEdge from "./statusEdge";
import ControlTool from "./controlTool";
import tw from "tailwind-styled-components";
import { arrowMarker } from "next-common/components/relationshipPopup/arrowMarker";
import { calculateNodePositionsHorizontal } from "next-common/utils/calculateNodePositionsHorizontal";
import Loading from "next-common/components/loading";
import { useEffect } from "react";
import { useTheme } from "styled-components";

const nodeTypes = {
  user: UserNode,
};

const edgeTypes = {
  statusedge: StatusEdge,
};

const RelationshipWraper = tw.div`
  h-[512px]
  border
  border-neutral300
  rounded-lg
  overflow-hidden
  bg-neutral200
`;

export default function Relationship({
  nodes: initialNodes,
  edges: initialEdges,
  loading = false,
}) {
  const calculatedNodes = calculateNodePositionsHorizontal(
    initialNodes,
    initialEdges,
  );

  if (loading) {
    return (
      <RelationshipWraper className="flex items-center justify-center">
        <Loading size={32} className="margin-auto" />
      </RelationshipWraper>
    );
  }

  return (
    <ReactFlowProvider>
      <RelationshipWraper>
        <RelationshipFlow
          calculatedNodes={calculatedNodes}
          initialEdges={initialEdges}
        />
      </RelationshipWraper>
    </ReactFlowProvider>
  );
}

function RelationshipFlow({ calculatedNodes, initialEdges }) {
  const { isDark } = useTheme();
  const reactFlow = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(calculatedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(calculatedNodes);
    reactFlow.fitView();
  }, [calculatedNodes, setNodes, reactFlow]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  return (
    nodes.length > 0 && (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        colorMode={isDark ? "dark" : "light"}
        nodesDraggable={false}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        attributionPosition="bottom-left"
      >
        <Background />
        <ControlTool />
        {arrowMarker}
      </ReactFlow>
    )
  );
}
