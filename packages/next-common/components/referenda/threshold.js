import styled, { css } from "styled-components";

const ThresholdScope = styled.div`
  position: absolute;
  top: 8px;
  right: 1px;
  bottom: 0;
  left: 1px;
`;

const Threshold = styled.div`
  position: relative;
  ${(p) =>
    p.threshold
      ? css`
          left: ${p.threshold};
        `
      : css`
          left: 50%;
        `}
  width: 2px;
  height: 1rem;
  ${(p) =>
    p.thin &&
    css`
      height: 12px;
    `}
  background-color: var(--neutral500);
  transform: translateX(-50%);
  z-index: 1;
`;

export default function ThresholdComponent({
  threshold,
  thin = false,
  className,
}) {
  return (
    <ThresholdScope className={className}>
      <Threshold threshold={threshold} thin={thin} />
    </ThresholdScope>
  );
}
