import React from "react";
import styled, { css } from "styled-components";
import Loading from "./loading";

const Wrapper = styled.button`
  all: unset;
  padding: 0 12px;
  height: 38px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid ${(props) => props.theme.grey300Border}
  line-height: 38px;
  text-align: center;
  display: inline-block;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 14px;
  ${(p) =>
    p.disabled &&
    css`
      background: ${p.theme.grey400Border} !important;
      color: ${p.theme.textContrast};
      border-color: ${p.theme.grey400Border} !important;
      cursor: not-allowed;
    `}
  ${(p) =>
    p.primary &&
    css`
      background: ${p.background || p.theme.primaryDarkBlue};
      color: ${p.theme.textContrast};
      border-color: ${p.theme.primaryDarkBlue};
    `}
  ${(p) =>
    p.primaryInverse &&
    css`
      background: ${p.background || p.theme.primaryPurple500};
      color: ${p.theme.textContrast};
      border-color: ${p.theme.primaryPurple500};
    `}
  ${(p) =>
    p.secondary &&
    css`
      background: ${p.background || p.theme.primaryDarkBlue};
      color: ${p.theme.textContrast};
      border-color: ${p.theme.primaryPurple500};
    `}
  ${(p) =>
    p.danger &&
    css`
      color: ${p.theme.secondaryRed500};
      border-color: ${p.theme.secondaryRed500};
    `}
  ${(p) =>
    p.isFill &&
    css`
      width: 100%;
    `}
  ${(p) =>
    p.isLoading &&
    css`
      pointer-events: none;
    `}
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ChildrenWrapper = styled.div`
  ${(p) =>
    p.isLoading &&
    css`
      opacity: 0;
    `}
`;

export default function Button({ children, ...props }) {
  return (
    <Wrapper {...props}>
      {props.isLoading && (
        <LoadingWrapper>
          {props.primary || props.secondary ? (
            <Loading size={14} color={"#ffffff"} />
          ) : (
            <Loading size={14} color={"#1e2134"} />
          )}
        </LoadingWrapper>
      )}
      <ChildrenWrapper isLoading={props.isLoading}>{children}</ChildrenWrapper>
    </Wrapper>
  );
}
