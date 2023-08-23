import Row from "next-common/components/listInfo/row";
import Anchor from "next-common/components/styled/anchor";
import { toPrecision } from "next-common/utils";
import Tag from "next-common/components/tags/state/tag";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import FlexBetween from "next-common/components/styled/flexBetween";
import Divider from "next-common/components/styled/layout/divider";
import businessCategory from "next-common/utils/consts/business/category";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";

const ChildBountyWrapper = styled.div`
  > div:first-child {
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
`;

const ChildBounty = styled(FlexBetween)`
  flex-grow: 1;

  a {
    flex-basis: 392px;
    font-weight: 400;
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--textPrimary);
  }

  > div {
    flex-basis: 240px;
    > div:first-child {
      flex-basis: 120px;
      display: flex;
      justify-content: end;
    }
    .symbol {
      color: var(--textTertiary);
    }
  }
  > div > span {
    height: 20px;
  }
`;

const ChildBountyMobile = styled(Flex)`
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
  }
  flex-wrap: wrap;
  padding: 12px 0;

  a {
    flex-basis: 100%;
    padding-right: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  > div {
    width: 100%;
  }
`;

const SemiBold = styled.span`
  font-weight: 500;
`;

const DividerWrapper = styled(FlexBetween)`
  flex-wrap: wrap;

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: var(--textTertiary);
      margin: 0 8px;
    }
  }

  > div {
    display: flex;
  }
`;

const DomesticLink = styled.a`
  margin-top: 16px;
  display: block;
  width: 60px;
  font-size: 12px;
  font-weight: 500;
  color: var(--theme500);
  cursor: pointer;
`;

function ChildBountiesTable({ childBounties }) {
  const { decimals, symbol } = useChainSettings();
  if (!childBounties?.items || !childBounties?.items?.length) {
    return null;
  }

  return (
    <div>
      {childBounties.items.map((bounty, index) => {
        return (
          <ChildBountyWrapper key={index}>
            <Row
              row={[
                `#${bounty.index}`,
                <ChildBounty key="child-bounty">
                  <Anchor
                    href={`/treasury/child-bounties/${bounty.parentBountyId}_${bounty.index}`}
                    title={bounty.title}
                  >
                    {bounty.title}
                  </Anchor>
                  <FlexBetween style={{ height: 23 }}>
                    <ValueDisplay
                      value={toPrecision(bounty.onchainData?.value, decimals)}
                      symbol={symbol}
                    />
                    <Tag
                      state={bounty.onchainData?.state?.state}
                      category={businessCategory.treasuryChildBounties}
                    />
                  </FlexBetween>
                </ChildBounty>,
              ]}
            />

            <ChildBountyMobile key={index}>
              <Anchor
                href={`/treasury/child-bounties/${bounty.parentBountyId}_${bounty.index}`}
                title={bounty.title}
              >
                {bounty.title}
              </Anchor>
              <Divider margin={8} />
              <FlexBetween>
                <DividerWrapper>
                  <SemiBold>#{bounty.index}</SemiBold>
                  <ValueDisplay
                    value={toPrecision(bounty.onchainData?.value, decimals)}
                    symbol={symbol}
                  />
                </DividerWrapper>
                <Tag
                  state={bounty.onchainData?.state?.state}
                  category={businessCategory.treasuryChildBounties}
                />
              </FlexBetween>
            </ChildBountyMobile>
          </ChildBountyWrapper>
        );
      })}

      {childBounties.total > 5 && (
        <DomesticLink
          href={`/treasury/child-bounties?parentBountyId=${childBounties.items[0].parentBountyId}`}
        >
          View all
        </DomesticLink>
      )}
    </div>
  );
}

export default ChildBountiesTable;
