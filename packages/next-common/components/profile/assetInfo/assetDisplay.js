import styled from "styled-components";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import tw from "tailwind-styled-components";
import BigNumber from "bignumber.js";

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
  [&_.value-display-symbol]:text-textTertiary
`;

const isZero = (value) => !value || new BigNumber(value).isZero();

export default function AssetDisplay({ accountInfo }) {
  const { decimals, symbol } = useChainSettings();

  const hasTransferrable = !isZero(accountInfo?.data?.transferrable);
  let hasFree = false;
  if (!hasTransferrable) {
    hasFree = true;
  }
  const hasBonded = !isZero(accountInfo?.data?.bonded);
  const hasLocked = !isZero(accountInfo?.data?.lockedBalance);
  const hasReserved = !isZero(accountInfo?.data?.reserved);

  let cellsNumber = 1;
  if (hasTransferrable) cellsNumber++;
  if (hasFree) cellsNumber++;
  if (hasBonded) cellsNumber++;
  if (hasLocked) cellsNumber++;
  if (hasReserved) cellsNumber++;

  return (
    <Wrapper style={{ maxWidth: cellsNumber * 161 }}>
      <Grid>
        <Item>
          <ItemTitle>Total</ItemTitle>
          <ItemValue>
            <ValueDisplay
              value={toPrecision(accountInfo?.data?.total, decimals)}
              symbol={symbol}
            />
          </ItemValue>
        </Item>
        {hasTransferrable && (
          <Item>
            <ItemTitle>Transferrable</ItemTitle>
            <ItemValue>
              <ValueDisplay
                value={toPrecision(accountInfo?.data?.transferrable, decimals)}
                symbol={symbol}
              />
            </ItemValue>
          </Item>
        )}
        {hasFree && (
          <Item>
            <ItemTitle>Free</ItemTitle>
            <ItemValue>
              <ValueDisplay
                value={toPrecision(accountInfo?.data?.free, decimals)}
                symbol={symbol}
              />
            </ItemValue>
          </Item>
        )}
        {hasBonded && (
          <Item>
            <ItemTitle>Bonded</ItemTitle>
            <ItemValue>
              <ValueDisplay
                value={toPrecision(accountInfo?.data?.bonded, decimals)}
                symbol={symbol}
              />
            </ItemValue>
          </Item>
        )}
        {hasLocked && (
          <Item>
            <ItemTitle>Locked</ItemTitle>
            <ItemValue>
              <ValueDisplay
                value={toPrecision(accountInfo?.data?.lockedBalance, decimals)}
                symbol={symbol}
              />
            </ItemValue>
          </Item>
        )}
        {hasReserved && (
          <Item>
            <ItemTitle>Reserved</ItemTitle>
            <ItemValue>
              <ValueDisplay
                value={toPrecision(accountInfo?.data?.reserved, decimals)}
                symbol={symbol}
              />
            </ItemValue>
          </Item>
        )}
      </Grid>
    </Wrapper>
  );
}
