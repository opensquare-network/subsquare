import styled from "styled-components";

const Wrapper = styled.img`
  width: ${(p) => `${p.size}px` ?? "12px"};
  height: ${(p) => `${p.size}px` ?? "12px"};
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

export default function Loading({ size = 12 }) {
  return <Wrapper size={size} src={`/imgs/icons/loading-tip.svg`} alt="" />;
}
