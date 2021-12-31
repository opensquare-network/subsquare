import styled, { css } from "styled-components";

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
      background: #c2c8d4;
      color: #ffffff;
      border: none;
    `}
  ${(p) =>
    p.primary &&
    css`
      background: #6848ff;
      color: #ffffff;
      border: none;
    `}
  ${(p) =>
    p.secondary &&
    css`
      background: #1e2134;
      color: #ffffff;
      border: none;
    `}
  ${(p) =>
    p.danger &&
    css`
      color: #f44336;
      border-color: #f44336;
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

const LoadingImg = styled.img`
  animation: loading 0.5s infinite linear;
  @keyframes loading {
    0% {
      -webkit-transform: rotate(0deg);
    }
    50% {
      -webkit-transform: rotate(180deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
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
          <LoadingImg
            src={
              props.primary || props.secondary
                ? "/imgs/icons/loading-white.svg"
                : "/imgs/icons/loading.svg"
            }
          />
        </LoadingWrapper>
      )}
      <ChildrenWrapper isLoading={props.isLoading}>{children}</ChildrenWrapper>
    </Wrapper>
  );
}
