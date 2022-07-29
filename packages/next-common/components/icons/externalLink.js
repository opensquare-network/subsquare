import React from "react";
import styled from "styled-components";

const Wrapper = styled.svg`
  stroke: ${(props) => props.color};
`;

export default function ExternalLinkIcon({ color = "#9DA9BB", size = 14 }) {
  return (
    <Wrapper
      className="external-link-icon"
      color={color}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4576_871166)">
        <path
          d="M7 7L12 2M12 2L12 7M12 2L7 2M4 2H2V12H12V10"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4576_871166">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </Wrapper>
  );
}
