import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import OverviewIcon from "../public/imgs/icons/overview.svg";
import DiscussionIcon from "../public/imgs/icons/discussions.svg";
import TipIcon from "../public/imgs/icons/tips.svg";
import ProposalIcon from "../public/imgs/icons/proposals.svg";
import Tip from "./tip/tip";

const Wrapper = styled.div`
  padding-top: 37px;

  > :not(:first-child) {
    margin-top: 24px;
  }
`;

const Title = styled.div`
  padding: 0 12px 16px;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: #9da9bb;
`;

const Item = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;

  :hover {
    background: #ebeef4;
  }
  

  > div {
    flex: 1 1 auto;
  }

  > :not(:first-child) {
    margin-left: 8px;
  }

  ${(p) =>
          p.active &&
          css`
            font-weight: 600;
            background: #ebeef4;
            color: #6848ff;

            > svg {
              *{
                fill: #6848FF;
              }
            }
          `}
`;

export default function Menu({menu}) {
  const router = useRouter();

  const iconMap = new Map([
    ['Overview', <OverviewIcon/>],
    ['Discussions', <DiscussionIcon/>],
    ['Tips', <TipIcon/>],
    ['Proposals', <ProposalIcon/>],
  ]);

  return (
    <Wrapper>
      {menu.map((item, index) => (
        <div key={index}>
          {item.name && <Title>{item.name}</Title>}
          {item.items.map((item, index) => (
            <Item
              key={index}
              active={router.pathname === item.pathname || (router.pathname === '/[chain]' && item.pathname === '/')}
              onClick={() => {
                if (item.pathname) {
                  if (item.pathname.startsWith("/[chain]")) {
                    router.push({
                      pathname: item.pathname,
                      query: {chain: router.query.chain},
                    });
                  } else {
                    router.push(item.pathname);
                  }
                }
              }}
            >
              {iconMap.get(item.name)}
              <div>{item.name}</div>
            </Item>
          ))}
        </div>
      ))}
    </Wrapper>
  );
}
