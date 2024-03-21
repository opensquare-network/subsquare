import styled from "styled-components";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import DelegationInfo from "next-common/components/summary/democracySummaryDelegation/democracySummaryDelegationInfo";
import DelegationButton from "./delegationButton";
import { useChainSettings } from "next-common/context/chain";
import useSubAddressTrackDelegating from "next-common/utils/hooks/referenda/useSubAddressTrackDelegating";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

export default function Delegation({ trackId }) {
  const realAddress = useRealAddress();
  const delegating = useSubAddressTrackDelegating(realAddress, trackId);
  const { hideActionButtons } = useChainSettings();

  return (
    <Wrapper>
      <DelegationInfo delegating={delegating} />
      {!hideActionButtons && (
        <DelegationButton delegating={delegating} trackId={trackId} />
      )}
    </Wrapper>
  );
}
