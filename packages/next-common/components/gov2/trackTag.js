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

export const trackTooltipTextMap = {
  0: "Origin with the highest level of privileges: The most powertul track. Changes here affect the entire network and need the highest trust and support.",
  1: "Origin able to dispatch a whitelisted call: Used for proposals pre-approved by trusted experts (the Fellowship). These are fast-tracked and low risk.",
  2: "Origin for signaling that the network wishes for some change: A public suggestion box. Anyone can propose improvements. Votes show community sentiment, but results arent enforced.",
  10: "Origin able to cancel slashes and manage minimum commission: Handles settings for staking - like how rewards work or how much DOT is needed to stake.",
  11: "Origin for spending up to 10,000,000 DOT from the treasury as well as generally administering it: Used to approve how the Polkadot treasury (community funds) is spent.",
  12: "Origin able to force slot leases: Manages technical details related to parachain slots and their lease periods.",
  13: "Origin for managing the composition of the fellowship: Controls the inner workings of the Fellowship - a group of trusted technical experts.",
  14: "Origin for managing the registrar and permissioned HRMP channel operations.",
  15: "Origin for starting auctions: Updates the rules for how parachain slot auctions work - like timing and participation.",
  20: "Origin able to cancel referenda: Cancels an already ongoing referendum.",
  21: "Origin able to kill referenda; Aims to instantly terminate an ongoing referendum, resulting in the slashing of both the Submission and Decision Deposits.",
  30: "Small, quick tips to contributors, spend up to 250 DOT from the treasury at once.",
  31: "Larger tips requiring broader support, spend up to 1,000 DOT from the treasury at once.",
  32: "Smaller treasury spends with quicker turnaround, spend up to 10,000 DOT from the treasury at once.",
  33: "Moderate-size treasury proposals. Balanced review, spend up to 100,000 DOT from the treasury at once.",
  34: "Large treasury spends. Requires strong support and review, spend up to 1,000,000 DOT from the treasury at once.",
};

export default function Gov2TrackTag({ name = "", id }) {
  const makeColorPair = (fg, bg) => ({ fg, bg });

  // NOTE: these colors support dark mode
  const trackColor = {
    root: makeColorPair("#4caf91", "rgba(76, 175, 145, 0.1)"),
  };

  const tooltipText = useMemo(() => {
    return trackTooltipTextMap[id];
  }, [id]);

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
