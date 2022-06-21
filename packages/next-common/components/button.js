import React from "react";
import styled, { css } from "styled-components";
import Loading from "./loading";
import {
  grey_400,
  primary_purple_500,
  primary_red_500,
  primary_space,
} from "../styles/colors";

const Wrapper = styled.button`
  all: unset;
  padding: 0 12px;
  height: 38px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #c2c8d5;
  line-height: 38px;
  text-align: center;
  display: inline-block;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 14px;
  ${(p) =>
    p.disabled &&
    css`
      background: ${grey_400} !important;
      color: #ffffff;
      border-color: ${grey_400} !important;
      cursor: not-allowed;
    `}
  ${(p) =>
    p.primary &&
    css`
      background: ${p.background || primary_space};
      color: #ffffff;
      border-color: ${primary_space};
    `}
  ${(p) =>
    p.primaryInverse &&
    css`
      background: ${p.background || primary_purple_500};
      color: #ffffff;
      border-color: ${primary_purple_500};
    `}
  ${(p) =>
    p.secondary &&
    css`
      background: ${p.background || primary_space};
      color: #ffffff;
      border-color: ${primary_space};
    `}
  ${(p) =>
    p.danger &&
    css`
      color: ${primary_red_500};
      border-color: ${primary_red_500};
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
