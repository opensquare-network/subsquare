import React from "react";
import styled from "styled-components";
import { useChain } from "next-common/context/chain";
import Tooltip from "../tooltip";
import AchainableSVG from "./achainable.svg";
import useAchainableData from "./useAchainableData";
import tw from "tailwind-styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4px 0;
  gap: 8px;
`;

const TagsWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = tw.div`
  text12Medium
  flex justify-center items-center
  py-0.5 px-2
  border border-neutral400 rounded
  whitespace-nowrap text-textSecondary
`;

const Footer = styled.div`
  display: flex;
  gap: 8px;

  font-weight: 500;
  font-size: 10px;
  line-height: 10px;

  color: var(--textTertiary);
  svg {
    cursor: pointer;
    path {
      fill: var(--textTertiary);
    }
    :hover {
      path {
        fill: var(--textSecondary);
      }
    }
  }
`;

function normalizeTagName(name, chain) {
  if (name?.toLowerCase().startsWith(`${chain} `)) {
    return name.replace(new RegExp(`^${chain}\\s`, "i"), "");
  }
  if (name?.toLowerCase().startsWith(`is ${chain} `)) {
    return name.replace(new RegExp(`^is ${chain} `, "i"), "");
  }
  return name;
}

function AchainableLebels({ labels }) {
  const chain = useChain();
  return (
    <TagsWrapper>
      {labels.map(({ name }) => {
        const normalizedName = normalizeTagName(name, chain);

        let tooltip = "";
        if (normalizedName === "Dolphin") {
          tooltip =
            "Total balance is between 0.01% and 0.1% of total issuance.";
        } else if (normalizedName === "Whale") {
          tooltip = "Total balance is >= 0.1% of the total issuance.";
        }

        return (
          <Tooltip key={normalizedName} content={tooltip}>
            <Tag>{normalizedName}</Tag>
          </Tooltip>
        );
      })}
    </TagsWrapper>
  );
}

// todo: remove this component
export default function AchainableProfile({ id }) {
  const data = useAchainableData(id);
  const { labels } = data || {};
  const visibleLabels = labels?.filter(
    (label) => label.result && label.name !== "Is Polkadot Fellowship Member",
  );

  if (!visibleLabels || !visibleLabels.length) {
    return null;
  }

  return (
    <Wrapper>
      <AchainableLebels labels={visibleLabels} />
      <Footer>
        <span>Labels Powered by</span>
        <a href="https://achainable.com" target="_blank" rel="noreferrer">
          <AchainableSVG />
        </a>
      </Footer>
    </Wrapper>
  );
}
