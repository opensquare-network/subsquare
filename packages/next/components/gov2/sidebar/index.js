import ExternalLinkIcon from "next-common/components/icons/externalLink";
import { p_12_normal } from "next-common/styles/componentCss";
import styled, { useTheme } from "styled-components";
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
`;

const Tip = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${(p) => p.theme.textTertiary};
  ${p_12_normal};
`;

// FIXME: gov2 sidebar href
// FIXME: vote button
export default function Gov2Sidebar({ detail, chain }) {
  const { primaryPurple500 } = useTheme();

  return (
    <Wrapper>
      <Gov2Status detail={detail} />
      <Gov2Tally chain={chain} detail={detail} />

      <VoteButton>Vote</VoteButton>

      <Tip href="/">
        How Goverenance V2 Works
        <ExternalLinkIcon color={primaryPurple500} />
      </Tip>
    </Wrapper>
  );
}
