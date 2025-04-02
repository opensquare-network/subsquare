export function calculateNodePositionsHorizontal(
  nodes,
  edges,
  nodeWidth = 240,
  nodeHeight = 100,
  horizontalGap = 150,
  verticalGap = 75,
) {
  const nodeMap = createNodeMap(nodes);
  const levels = assignLevels(nodes, edges);
  const positionedNodes = positionNodes(
    levels,
    nodeMap,
    nodeWidth,
    nodeHeight,
    horizontalGap,
    verticalGap,
  );

  return positionedNodes;
}

function createNodeMap(nodes) {
  return new Map(
    nodes.map((node) => [node.id, { ...node, position: { x: 0, y: 0 } }]),
  );
}

function assignLevels(nodes, edges) {
  const levels = new Map();
  const visited = new Set();

  function traverseLevel(nodeId, level) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    levels.set(nodeId, level);

    const targets = edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => edge.target);
    targets.forEach((target) => traverseLevel(target, level + 1));
  }

  const rootNodes = nodes.filter(
    (node) => !edges.some((edge) => edge.target === node.id),
  );
  rootNodes.forEach((node) => traverseLevel(node.id, 0));

  return levels;
}

function positionNodes(
  levels,
  nodeMap,
  nodeWidth,
  nodeHeight,
  horizontalGap,
  verticalGap,
) {
  const nodesByLevel = groupNodesByLevel(levels);

  for (const [level, nodeIds] of nodesByLevel) {
    const totalHeight = calculateTotalHeight(
      nodeIds.length,
      nodeHeight,
      verticalGap,
    );
    const startY = -totalHeight / 2;

    nodeIds.forEach((nodeId, index) => {
      const node = nodeMap.get(nodeId);
      node.position = {
        x: level * (nodeWidth + horizontalGap),
        y: startY + index * (nodeHeight + verticalGap),
      };
    });
  }

  return Array.from(nodeMap.values());
}

function groupNodesByLevel(levels) {
  const nodesByLevel = new Map();

  for (const [nodeId, level] of levels) {
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level).push(nodeId);
  }

  return nodesByLevel;
}

function calculateTotalHeight(nodeCount, nodeHeight, verticalGap) {
  return (nodeCount - 1) * (nodeHeight + verticalGap);
}
