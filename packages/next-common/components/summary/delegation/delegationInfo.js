import styled from "styled-components";
import { Conviction } from "utils/referendumUtil";
import { useChainSettings } from "../../../context/chain";
import { toPrecision } from "../../../utils";
import VoteLabel from "../../democracy/votesPopup/voteLabel";
import ValueDisplay from "../../displayValue";
import User from "../../user";

const Wrapper = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${(p) => p.theme.textTertiary};

  display: flex;
  align-items: center;
  padding: 4px 12px;
  gap: 8px;
  background: ${(p) => p.theme.grey100Bg};
  border-radius: 4px;

  > :nth-child(3),
  > :nth-child(4) {
    ::before {
      content: "·";
      margin-right: 8px;
      color: ${(p) => p.theme.textTertiary};
    }
    color: ${(p) => p.theme.textSecondary};
  }
`;

export default function DelegationInfo({ delegating }) {
  const node = useChainSettings();
  if (!delegating) {
    return <div />;
  }

  const conviction = Conviction[delegating.conviction];

  return (
    <Wrapper>
      <span>Delegating to</span>
      <User add={delegating.target} />
      <span>
        <VoteLabel conviction={conviction} />
      </span>
      <ValueDisplay
        value={toPrecision(delegating.balance, node.decimals)}
        symbol={node.symbol}
      />
    </Wrapper>
  );
}
