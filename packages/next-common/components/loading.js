import styled, { css } from "styled-components";
import LoadingIcon from "../assets/imgs/icons/loading.svg";

const ColorLoadingIcon = styled(LoadingIcon)`
  ${p => p.color && css`
    > path {
        fill: ${p.color};
      }
  `}
`;

export default function Loading({ size = 12, color }) {
  return (
    <ColorLoadingIcon width={size} height={size} color={color} viewBox="0 0 14 14" />
  );
}
