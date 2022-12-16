import BigNumber from "bignumber.js";
import { useChainSettings } from "next-common/context/chain";
import { p_14_medium, p_14_normal } from "next-common/styles/componentCss";
import { toPrecision } from "next-common/utils";
import styled from "styled-components";
import SupportSVG from "next-common/assets/imgs/icons/support.svg";
import BalanceSVG from "next-common/assets/imgs/icons/balance.svg";
import AddressesSVG from "next-common/assets/imgs/icons/addresses.svg";
import Flex from "next-common/components/styled/flex";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    ::before {
      content: "";
      display: block;
      height: 1px;
      width: 100%;
      background: ${(p) => p.theme.grey200Border};
    }
  }
`;

const Item = styled(Flex)`
  justify-content: space-between;
  margin: 12px 0;
`;

const Title = styled(Flex)`
  gap: 8px;

  ${p_14_medium};
  color: ${(p) => p.theme.textPrimary};
`;

const Value = styled.div`
  ${p_14_normal};
  color: ${(p) => p.theme.textPrimary};
`;

export default function DelegationSummary({ beenDelegatedList }) {
  const node = useChainSettings();

  const balance = beenDelegatedList.reduce(
    (acc, cur) => acc.plus(cur.balance),
    new BigNumber(0)
  );
  const support = beenDelegatedList.reduce(
    (acc, cur) => acc.plus(cur.balance),
    new BigNumber(0)
  );

  return (
    <Wrapper>
      <div>
        <Item>
          <Title>
            <BalanceSVG />
            Balance
          </Title>
          <Value>
            {toPrecision(balance, node.decimals)} {node.symbol}
          </Value>
        </Item>
      </div>
      <div>
        <Item>
          <Title>
            <SupportSVG />
            Support
          </Title>
          <Value>
            {toPrecision(support, node.decimals)} {node.symbol}
          </Value>
        </Item>
      </div>
      <div>
        <Item>
          <Title>
            <AddressesSVG />
            Address
          </Title>
          <Value>{beenDelegatedList.length}</Value>
        </Item>
      </div>
    </Wrapper>
  );
}
