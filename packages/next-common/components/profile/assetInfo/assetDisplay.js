import styled from "styled-components";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import tw from "tailwind-styled-components";
import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";

const Wrapper = styled.div`
  border-radius: 8px;
  border: 1px solid var(--neutral300);
  margin-top: 16px;
  width: 100%;
  overflow: hidden;
`;

const Grid = styled.div`
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  margin-right: -1px;
  margin-bottom: -1px;
`;

const Item = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 58px;

  border-bottom: 1px solid var(--neutral300);
  border-right: 1px solid var(--neutral300);
`;

const ItemTitle = tw.span`
  text-textTertiary
  text12Medium
`;

const ItemValue = tw.span`
  text-textPrimary
  text14Bold
`;

const isEmpty = (value) => !value || new BigNumber(value).isZero();

function AssetItem({ value, title }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <Item>
      <ItemTitle>{title}</ItemTitle>
      <ItemValue>
        <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />
      </ItemValue>
    </Item>
  );
}

export default function AssetDisplay({ accountInfo }) {
  const showTransferrable = !isNil(accountInfo?.data?.transferrable);
  const showBonded = !isEmpty(accountInfo?.data?.bonded);
  const showLocked = !isEmpty(accountInfo?.data?.lockedBalance);

  let cellsNumber = 3;
  if (showBonded) cellsNumber++;
  if (showLocked) cellsNumber++;

  return (
    <Wrapper style={{ maxWidth: cellsNumber * 161 }}>
      <Grid>
        <AssetItem value={accountInfo?.data?.total} title="Total" />

        {showTransferrable ? (
          <AssetItem
            value={accountInfo?.data?.transferrable}
            title="Transferrable"
          />
        ) : (
          <AssetItem value={accountInfo?.data?.free} title="Free" />
        )}

        {showBonded && (
          <AssetItem value={accountInfo?.data?.bonded} title="Bonded" />
        )}

        {showLocked && (
          <AssetItem value={accountInfo?.data?.lockedBalance} title="Locked" />
        )}

        <AssetItem value={accountInfo?.data?.reserved} title="Reserved" />
      </Grid>
    </Wrapper>
  );
}
