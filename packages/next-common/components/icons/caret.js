import React from "react";
import styled from "styled-components";

const SVG = styled.svg`
  path {
    stroke: ${(props) =>
      props.isGrey ? "var(--textprimary)" : "var(--textprimary)"};
  }
`;

export default function Caret({
  isGrey = false,
  size = 14,
  down = true,
  ...props
}) {
  return (
    <SVG
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      transform={`rotate(${down ? 0 : 180})`}
      xmlns="http://www.w3.org/2000/svg"
      isGrey={isGrey}
      {...props}
    >
      <path
        d="M10 6L7 9L4 6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  );
}
