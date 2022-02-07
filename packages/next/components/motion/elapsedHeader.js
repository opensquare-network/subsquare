import styled from 'styled-components';
import { useSelector } from "react-redux";
import { nodesHeightSelector } from "store/reducers/nodeSlice";
import CountDown from "components/countDown";
import { useBlockTime } from "utils/hooks";
import { bigNumber2Locale } from "utils";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 8px;

  position: static;
  height: 38px;

  background: #F6F7FA;
  border-radius: 4px;

  margin-bottom: 16px;
  color: rgba(80, 97, 118, 1);
`;

export default function ElapseHeader({ data, type = "full", chain }) {
  const currentFinalHeight = useSelector(nodesHeightSelector);
  const motionEndHeight = data.onchainData?.voting?.end;
  const motionStartHeight = data.onchainData?.indexer?.blockHeight;
  const blockTime = useBlockTime(currentFinalHeight - motionEndHeight, chain)

  if (!motionEndHeight || !currentFinalHeight || currentFinalHeight >= motionEndHeight || !blockTime) {
    return null;
  }

  const elapsePercent = (currentFinalHeight - motionStartHeight) / (motionEndHeight - motionStartHeight);
  return (
    <Wrapper>
      <CountDown percent={parseInt(elapsePercent * 100)} />
      {
        type === "full"
        ? <span>{`End in ${blockTime}, #${bigNumber2Locale(motionEndHeight.toString())}`}</span>
        : type === "simple"
        ? <span>{`End in ${blockTime}`}</span>
        : null
      }
    </Wrapper>
  );
}