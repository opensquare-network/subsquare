import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import * as d3 from "d3";
import * as d3shape from "d3-shape";

const Wrapper = styled.div`
`;

const Center = styled.div`
  display: flex;
  align-items: center;
`;

const CountDown = ({ percent = 0, size = 12 }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const outerRadius = size / 2;
    const innerRadius = (size - 6) / 2;
    const angle = 2 * Math.PI * percent / 100;

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${outerRadius},${outerRadius})`)

    const arc1 = d3shape.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(angle);
    svg.append("path")
      .attr("d", arc1)
      .style("fill", "#2196f3")
      .style("stroke-width", "0");

    const arc2 = d3shape.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(angle)
      .endAngle(2 * Math.PI);
    svg.append("path")
      .attr("d", arc2)
      .style("fill", "#d3eafd")
      .style("stroke-width", "0");

  }, [percent, size]);

  return (
    <Wrapper>
      <Center>
        <svg ref={svgRef} width={size} height={size} />
      </Center>
    </Wrapper>
  );
};

export default CountDown;
