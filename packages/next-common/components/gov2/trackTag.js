import React, { useMemo } from "react";
import styled from "styled-components";
import { startCase } from "lodash-es";
import Tooltip from "../tooltip";

const Tag = styled.span`
  padding: 2px 8px;
  border-radius: 10px;
  color: ${(p) => p.fg || "var(--textSecondary)"};
  background-color: ${(p) => p.bg || "var(--neutral200)"};
`;

const tooltipTextMap = {
  root: "The most powertul track. Changes here affect the entire network and need the highest trust and support.",
  whitelisted_caller:
    "Used for proposals pre-approved by trusted experts (the Fellowship). These are fast-tracked and low risk.",
  staking_admin:
    "Handles settings for staking - like how rewards work or how much DOT is needed to stake.",
  treasurer:
    "Used to approve how the Polkadot treasury (community funds) is spent.",
  lease_admin:
    "Manages technical details related to parachain slots and their lease periods.",
  fellowship_admin:
    "Controls the inner workings of the Fellowship - a group of trusted technical experts.",
  general_admin:
    "Used to change general settings in the network that don't fit other categories.",
  auction_admin:
    "Updates the rules for how parachain slot auctions work - like timing and participation.",
  referendum_canceller:
    "This track is designed to cancel an already ongoing referendum.",
  referendum_killer:
    "This track aims to instantly terminate an ongoing referendum, resulting in the slashing of both the Submission and Decision Deposits.",
  small_tipper: "Small, quick tips to contributors.",
  big_tipper: "Larger tips requiring broader support.",
  small_spender: "Smaller treasury spends with quicker turnaround.",
  medium_spender: "Moderate-size treasury proposals. Balanced review.",
  big_spender: "Large treasury spends. Requires strong support and review.",
};

export default function Gov2TrackTag({ name = "" }) {
  const makeColorPair = (fg, bg) => ({ fg, bg });

  // NOTE: these colors support dark mode
  const trackColor = {
    root: makeColorPair("#4caf91", "rgba(76, 175, 145, 0.1)"),
  };

  const tooltipText = useMemo(() => {
    return tooltipTextMap[name];
  }, [name]);

  if (tooltipText) {
    return (
      <Tooltip content={tooltipText} contentClassName="max-w-[240px]">
        <Tag
          className="text12Medium"
          fg={trackColor[name]?.fg}
          bg={trackColor[name]?.bg}
        >
          {startCase(name)}
        </Tag>
      </Tooltip>
    );
  }

  return (
    <Tag
      className="text12Medium"
      fg={trackColor[name]?.fg}
      bg={trackColor[name]?.bg}
    >
      {startCase(name)}
    </Tag>
  );
}
