import ExternalLink from "next-common/components/externalLink";
import ExternalLinkIcon from "next-common/components/icons/externalLink";
import { p_12_normal } from "next-common/styles/componentCss";
import { emptyFunction } from "next-common/utils";
import { gov2State } from "next-common/utils/consts/state";
import { mdcss } from "next-common/utils/responsive";
import dynamic from "next/dynamic";
import { useState } from "react";
import styled, { useTheme, css } from "styled-components";
import Gov2Status from "./status";
import Gov2Tally from "./tally";

const Popup = dynamic(() => import("../votePopup"), {
  ssr: false,
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  top: 32px;
  width: 300px;
  margin-top: 0 !important;
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 1024px) {
    position: static;
    width: auto;
    margin-top: 16px !important;
  }
`;

const VoteButton = styled.button`
  all: unset;
  cursor: pointer;
  margin-top: 16px;
  line-height: 38px;
  background-color: ${(props) => props.theme.primaryDarkBlue};
  color: ${(props) => props.theme.textContrast};
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  border-radius: 4px;

  ${mdcss(css`
    margin: 0 24px;
  `)}
`;

const Link = styled(ExternalLink)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${(p) => p.theme.textTertiary};
  ${p_12_normal};

  ${mdcss(css`
    margin: 0 24px;
  `)}
`;

export default function Gov2Sidebar({
  detail,
  onVoteFinalized = emptyFunction,
}) {
  const { primaryPurple500 } = useTheme();
  const [showVote, setShowVote] = useState(false);
  const referendumIndex = detail?.referendumIndex;
  const trackId = detail?.track;
  const showVoteButton = [gov2State.Deciding, gov2State.Confirming].includes(
    detail?.state?.name
  );

  const shouldShowStatus = [
    gov2State.Deciding,
    gov2State.Confirming,
    gov2State.Approved,
    gov2State.Executed,
  ].includes(detail?.state?.name);

  return (
    <Wrapper>
      {shouldShowStatus && <Gov2Status />}

      <Gov2Tally detail={detail} />

      {showVoteButton && (
        <VoteButton
          onClick={() => {
            setShowVote(true);
          }}
        >
          Vote
        </VoteButton>
      )}
      {showVote && (
        <Popup
          onClose={() => setShowVote(false)}
          referendumIndex={referendumIndex}
          trackId={trackId}
          onFinalized={onVoteFinalized}
        />
      )}

      {/* NOTE: link to polkadot gov2 blog */}
      <Link href="https://polkadot.network/blog/gov2-polkadots-next-generation-of-decentralised-governance/">
        How Goverenance V2 Works
        <ExternalLinkIcon color={primaryPurple500} />
      </Link>
    </Wrapper>
  );
}
