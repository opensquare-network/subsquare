import styled from "styled-components";
import ChildBountyClaim from "./Action";
import Meta from "./metadata";
import { useOnchainData } from "next-common/context/post";
import { useChainSettings } from "next-common/context/chain";

const WRAPPER_WIDTH = 300;

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 40px;
  width: ${WRAPPER_WIDTH}px;
  margin-top: 0 !important;
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 1024px) {
    position: static;
    width: auto;
    margin-top: 16px !important;
  }
`;

export default function Claim() {
  const { hideActionButtons } = useChainSettings();
  const onChain = useOnchainData();
  if (!["PendingPayout", "Claimed"].includes(onChain.state?.state)) {
    return null;
  }

  return <Wrapper>
    <Meta />
    {!hideActionButtons && <ChildBountyClaim />}
  </Wrapper>;
}
