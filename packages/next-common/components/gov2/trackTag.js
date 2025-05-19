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
  root: "Origin with the highest level of privileges: The most powertul track. Changes here affect the entire network and need the highest trust and support.",
  whitelisted_caller:
    "Origin able to dispatch a whitelisted call: Used for proposals pre-approved by trusted experts (the Fellowship). These are fast-tracked and low risk.",
  wish_for_change:
    "Origin for signaling that the network wishes for some change: A public suggestion box. Anyone can propose improvements. Votes show community sentiment, but results arent enforced.",
  staking_admin:
    "Origin able to cancel slashes and manage minimum commission: Handles settings for staking - like how rewards work or how much DOT is needed to stake.",
  treasurer:
    "Origin for spending up to 10,000,000 DOT from the treasury as well as generally administering it: Used to approve how the Polkadot treasury (community funds) is spent.",
  lease_admin:
    "Origin able to force slot leases: Manages technical details related to parachain slots and their lease periods.",
  fellowship_admin:
    "Origin for managing the composition of the fellowship: Controls the inner workings of the Fellowship - a group of trusted technical experts.",
  general_admin:
    "Origin for managing the registrar and permissioned HRMP channel operations.",
  auction_admin:
    "Origin for starting auctions: Updates the rules for how parachain slot auctions work - like timing and participation.",
  referendum_canceller:
    "Origin able to cancel referenda: Cancels an already ongoing referendum.",
  referendum_killer:
    "Origin able to kill referenda; Aims to instantly terminate an ongoing referendum, resulting in the slashing of both the Submission and Decision Deposits.",
  small_tipper:
    "Small, quick tips to contributors, spend around 250 DOT from the treasury at once.",
  big_tipper:
    "Larger tips requiring broader support, spend around 1,000 DOT from the treasury at once.",
  small_spender:
    "Smaller treasury spends with quicker turnaround, spend around 10,000 DOT from the treasury at once.",
  medium_spender:
    "Moderate-size treasury proposals. Balanced review, spend around 100,000 DOT from the treasury at once.",
  big_spender:
    "Large treasury spends. Requires strong support and review, spend up to 1,000,000 DOT from the treasury at once.",
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
