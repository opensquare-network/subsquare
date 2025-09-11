import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { useRelationshipNodes } from "next-common/context/relationship";
import Loading from "next-common/components/loading";
import tw from "tailwind-styled-components";
import { useTheme } from "styled-components";

const RelationshipWrapper = tw.div`
  h-[512px]
  border
  border-neutral300
  rounded-lg
  overflow-hidden
  bg-neutral200
  relative
`;

const SvgContainer = tw.svg`
  w-full
  h-full
  cursor-grab
  active:cursor-grabbing
`;

const createArrowMarker = (svg, isDark) => {
  const defs = svg.append("defs");
  const arrowColor = isDark ? "#666" : "#999";
  defs
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 25)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("xoverflow", "visible")
    .append("path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5")
    .attr("fill", arrowColor)
    .style("stroke", "none");
};

const createEdges = (svg, edges, isDark) => {
  const linkColor = isDark ? "#666" : "#999";
  return svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(edges)
    .enter()
    .append("line")
    .attr("stroke", linkColor)
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", (d) => Math.sqrt(d.amount || d.value || 1) * 2)
    .attr("marker-end", "url(#arrowhead)");
};

const createNodes = (
  svg,
  nodes,
  isDark,
  selectedNode,
  setSelectedNode,
  simulation,
) => {
  const nodeColors = {
    root: isDark ? "#ff6b6b" : "#e74c3c",
    normal: isDark ? "#4ecdc4" : "#3498db",
    selected: isDark ? "#f39c12" : "#f1c40f",
  };

  const node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended),
    );

  node
    .append("circle")
    .attr("r", (d) => (d.isRoot ? 25 : 20))
    .attr("fill", (d) => {
      if (selectedNode && selectedNode.id === d.id) return nodeColors.selected;
      return d.isRoot ? nodeColors.root : nodeColors.normal;
    })
    .attr("stroke", isDark ? "#fff" : "#333")
    .attr("stroke-width", (d) => (d.isRoot ? 3 : 2))
    .style("cursor", "pointer")
    .on("click", (event, d) => {
      setSelectedNode(selectedNode?.id === d.id ? null : d);
      event.stopPropagation();
    });

  const textColor = isDark ? "#fff" : "#333";
  node
    .append("text")
    .attr("dx", 0)
    .attr("dy", 35)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", textColor)
    .attr("font-weight", (d) => (d.isRoot ? "bold" : "normal"))
    .text((d) => d.displayName || d.address.slice(0, 8) + "...");

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    const t = d3.zoomTransform(svg.node());
    const [x, y] = t.invert([event.x, event.y]);
    d.fx = x;
    d.fy = y;
  }

  function dragged(event, d) {
    const t = d3.zoomTransform(svg.node());
    const [x, y] = t.invert([event.x, event.y]);
    d.fx = x;
    d.fy = y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    const t = d3.zoomTransform(svg.node());
    const [x, y] = t.invert([event.x, event.y]);
    d.fx = x;
    d.fy = y;
  }

  return node;
};

export default function TransferRelationship() {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const { isDark } = useTheme();
  const {
    nodes: initialNodes,
    edges: initialEdges,
    isLoading: loading,
  } = useRelationshipNodes();

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (
      !dimensions.width ||
      !dimensions.height ||
      loading ||
      !initialNodes?.length
    ) {
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const processedEdges = initialEdges.map((edge) => ({
      source: edge.from || edge.source,
      target: edge.to || edge.target,
      amount: edge.amount || edge.value || 1,
    }));

    const simulation = d3
      .forceSimulation(initialNodes)
      .force(
        "link",
        d3
          .forceLink(processedEdges)
          .id((d) => d.id || d.address)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force(
        "center",
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2),
      )
      .force("collision", d3.forceCollide().radius(50));

    createArrowMarker(svg, isDark);

    const link = createEdges(svg, processedEdges, isDark);

    const node = createNodes(
      svg,
      initialNodes,
      isDark,
      selectedNode,
      setSelectedNode,
      simulation,
    );

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        svg.select(".links").attr("transform", event.transform);
        svg.select(".nodes").attr("transform", event.transform);
      });

    svg.call(zoom);

    svg.on("click", (event) => {
      if (event.target === svg.node()) {
        setSelectedNode(null);
      }
    });

    return () => {
      simulation.stop();
    };
  }, [dimensions, initialNodes, initialEdges, loading, isDark, selectedNode]);

  if (loading) {
    return (
      <RelationshipWrapper className="flex items-center justify-center">
        <Loading size={32} className="margin-auto" />
      </RelationshipWrapper>
    );
  }

  return (
    <RelationshipWrapper>
      <SvgContainer ref={svgRef} />
    </RelationshipWrapper>
  );
}
