import Row from "next-common/components/listInfo/row";
import Anchor from "next-common/components/styled/anchor";
import { toPrecision } from "../../utils";
import Tag from "next-common/components/tag";
import Accordion from "next-common/components/listInfo/accordion";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import FlexBetween from "next-common/components/styled/flexBetween";

const ChildBountyWrapper = styled.div`
  > div:first-child {
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
`

const ChildBounty = styled(FlexBetween)`
  flex-grow: 1;

  a {
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #1E2134;
  }

  > div {
    flex-basis: 240px;
  }
`

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
`

const Divider = styled.div`
  margin: 8px 0;
  height: 1px;
  background-color: #e6e6e6;
`

const SemiBold = styled.span`
  font-weight: 500;
`

const DividerWrapper = styled(FlexBetween)`
  flex-wrap: wrap;

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: #9da9bb;
      margin: 0 8px;
    }
  }
`;

const Accessory = styled.span`
  color: #9da9bb;
`

const DomesticLink = styled.a`
  margin-top: 16px;
  display: block;
  width: 60px;
  font-size: 12px;
  font-weight: 500;
  color: #6848FF;
  cursor: pointer;
`

function ChildBountiesTable({
                              childBounties,
                              decimals,
                              symbol,
                            }) {
  if (!childBounties?.items || !childBounties?.items?.length) {
    return null;
  }
  return <Accordion title="Child Bounties">
    {
      childBounties.items.map((bounty, index) => {
          return (<ChildBountyWrapper key={index}>
            <Row
              row={[`#${bounty.index}`,
                // eslint-disable-next-line react/jsx-key
                <ChildBounty>
                  <Anchor href={`/treasury/child-bounty/${bounty.parentBountyId}_${bounty.index}`}
                          title={bounty.description}
                  >{bounty.description}</Anchor>
                  <FlexBetween>
                    <SemiBold>
                      {toPrecision(bounty.value, decimals)}
                      {" "}
                      <Accessory>
                        {symbol}
                      </Accessory>
                    </SemiBold>
                    <Tag name={bounty.state.state}/>
                  </FlexBetween>
                </ChildBounty>
              ]}/>

            <ChildBountyMobile key={index}>
              <Anchor href={`/treasury/child-bounty/${bounty.parentBountyId}_${bounty.index}`}
                      title={bounty.description}>
                {bounty.description}
              </Anchor>
              <Divider/>
              <FlexBetween>
                <DividerWrapper>
                  <SemiBold>#{bounty.index}</SemiBold>
                  <span> <SemiBold> {toPrecision(bounty.value, decimals)}</SemiBold>  <Accessory>{symbol}</Accessory></span>
                </DividerWrapper>
                <Tag name={bounty.state.state}/>
              </FlexBetween>
            </ChildBountyMobile>
          </ChildBountyWrapper>)
        }
      )
    }

    {
      childBounties.total > 5 &&
      <DomesticLink href={`/treasury/child-bounties?parentBountyId=${childBounties.items[0].parentBountyId}`}>View
        all</DomesticLink>
    }
  </Accordion>
}

export default ChildBountiesTable;
