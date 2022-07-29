import styled, { css } from "styled-components";
import React, { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import OverviewIcon from "../assets/imgs/icons/overview.svg";
import DiscussionIcon from "../assets/imgs/icons/discussions.svg";
import PolkassemblyDiscussionIcon from "../assets/imgs/icons/polkassembly-discussion.svg";
import TipIcon from "../assets/imgs/icons/tips.svg";
import ProposalIcon from "../assets/imgs/icons/proposals.svg";
import MotionIcon from "../assets/imgs/icons/type-motions.svg";
import ReferendaIcon from "../assets/imgs/icons/type-referenda.svg";
import DemocracyProposalIcon from "../assets/imgs/icons/type-proposals.svg";
import UserIcon from "../assets/imgs/icons/user.svg";
import AddressIcon from "../assets/imgs/icons/address.svg";
import BellIcon from "../assets/imgs/icons/bell.svg";
import MembersIcon from "../assets/imgs/icons/members.svg";
import BountyIcon from "../assets/imgs/icons/bounties.svg";
import ExternalLink from "./icons/externalLink";

const Wrapper = styled.div`
  padding-top: 37px;
  padding-bottom: 32px;
  > :not(:first-child) {
    margin-top: 16px;
  }
  a {
    display: block;
  }
`;

const Title = styled.div`
  padding: 0 12px 12px;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: ${(props) => props.theme.textTertiary};
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
  color: ${(props) => props.theme.textSecondary};
  > svg {
    path {
      fill: ${(props) => props.theme.textSecondary};
    }
  }

  :hover {
    color: ${(props) => props.theme.primaryPurple500};

    > svg {
      &:first-child {
        path {
          fill: ${(props) => props.theme.primaryPurple500};
        }
      }
    }
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
      background: ${(props) => props.theme.grey200Border};
      color: ${(props) => props.theme.primaryPurple500};

      > svg {
        path {
          fill: ${(props) => props.theme.primaryPurple500};
        }
      }
    `}
`;

export default function Menu({ menu, chain }) {
  const router = useRouter();

  const iconMap = new Map();
  iconMap.set("overview", <OverviewIcon />);
  iconMap.set("discussions", <DiscussionIcon />);
  iconMap.set("polkassembly-discussions", <PolkassemblyDiscussionIcon />);
  iconMap.set("offChainVoting", <ReferendaIcon />);
  iconMap.set("tips", <TipIcon />);
  iconMap.set("proposals", <ProposalIcon />);
  iconMap.set("bounties", <BountyIcon />);
  iconMap.set("child-bounties", <BountyIcon />);
  iconMap.set("motions", <MotionIcon />);
  iconMap.set("referenda", <ReferendaIcon />);
  iconMap.set("democracyProposals", <DemocracyProposalIcon />);
  iconMap.set("democracyExternals", <DemocracyProposalIcon />);
  iconMap.set("techCommProposals", <DemocracyProposalIcon />);
  iconMap.set("account", <UserIcon />);
  iconMap.set("linked-address", <AddressIcon />);
  iconMap.set("notification", <BellIcon />);
  iconMap.set("councilMembers", <MembersIcon />);
  iconMap.set("techCommMembers", <MembersIcon />);
  iconMap.set("financialCouncilMembers", <MembersIcon />);
  iconMap.set("financialMotions", <MotionIcon />);

  return (
    <Wrapper>
      {menu.map((item, index) => {
        if (item?.excludeToChains?.includes(chain)) {
          return null;
        }
        return (
          <div key={index}>
            {item.name && <Title>{item.name}</Title>}
            {item.items.map((item, index) => {
              const isExternalLink = (item.pathname || "").startsWith("http");

              if (item?.excludeToChains?.includes(chain)) {
                return null;
              }
              return (
                <Fragment key={index}>
                  <Link href={item?.pathname} passHref>
                    <a target={isExternalLink ? "_blank" : "_self"}>
                      <Item
                        active={
                          router.pathname === item.pathname ||
                          (router.pathname === "/[chain]" &&
                            item.pathname === "/")
                        }
                      >
                        {iconMap.get(item.value)}
                        <span>{item.name}</span>
                        {isExternalLink && <ExternalLink color="#D7DEE8" />}
                      </Item>
                    </a>
                  </Link>
                </Fragment>
              );
            })}
          </div>
        );
      })}
    </Wrapper>
  );
}
