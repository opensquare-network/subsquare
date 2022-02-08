import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { select } from "d3-selection";
import { arc } from "d3-shape";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CountDown = ({ percent = 0, size = 12 }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const outerRadius = size / 2;
    const innerRadius = outerRadius / 2;
    const angle = 2 * Math.PI * percent / 100;

    const svgEl = select(svgRef.current);
    svgEl.selectAll("*").remove();
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${outerRadius},${outerRadius})`)

    const arc1 = arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(angle);
    svg.append("path")
      .attr("d", arc1)
      .style("fill", "#2196f3")
      .style("stroke-width", "0");

    const arc2 = arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(angle)
      .endAngle(2 * Math.PI);
    svg.append("path")
      .attr("d", arc2)
      .style("fill", "#d3eafd")
      .style("stroke-width", "0");

  }, [percent, size, svgRef]);

  return (
    <Wrapper>
      <svg ref={svgRef} width={size} height={size} />
    </Wrapper>
  );
};

export default CountDown;
