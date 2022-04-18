import styled from "styled-components";
import LoadingIcon from "../assets/imgs/icons/loading.svg";

const WhiteLoadingIcon = styled(LoadingIcon)`
  > path {
    fill: #ffffff;
  }
`;

export default function Loading({ size = 12, white = false }) {
  return white ? (
    <WhiteLoadingIcon width={size} height={size} viewBox="0 0 14 14" />
  ) : (
    <LoadingIcon width={size} height={size} viewBox="0 0 14 14" />
  );
}
