import ExternalLink from "next-common/components/externalLink";
import ExternalLinkIcon from "next-common/components/icons/externalLink";
import { p_12_normal } from "next-common/styles/componentCss";
import { mdcss } from "next-common/utils/responsive";
import styled, { useTheme, css } from "styled-components";
import Gov2Status from "./status";
import Gov2Tally from "./tally";

const Wrapper = styled.div`
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
  width: 100%;
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

// FIXME: status
// FIXME: vote button
export default function Gov2Sidebar({ detail, chain }) {
  const { primaryPurple500 } = useTheme();

  return (
    <Wrapper>
      {false && <Gov2Status detail={detail} />}

      <Gov2Tally chain={chain} detail={detail} />

      {false && <VoteButton>Vote</VoteButton>}

      {/* NOTE: link to polkadot gov2 blog */}
      <Link href="https://polkadot.network/blog/gov2-polkadots-next-generation-of-decentralised-governance/">
        How Goverenance V2 Works
        <ExternalLinkIcon color={primaryPurple500} />
      </Link>
    </Wrapper>
  );
}
