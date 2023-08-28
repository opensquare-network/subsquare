import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Icon from "../../assets/imgs/icons/new-discussion.svg";
import { TitleContainer } from "../styled/containers/titleContainer";
import { NeutralPanel } from "../styled/containers/neutralPanel";
import { useChain } from "../../context/chain";
import Chains from "../../utils/consts/chains";
import PrimaryButton from "../buttons/primaryButton";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const EmptyPanel = styled(NeutralPanel)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 48px;
  box-sizing: border-box;
  box-shadow: var(--shadow100);

  > .title {
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 100%;
    text-align: center;
    color: var(--textPrimary);
    margin-bottom: 16px;
  }

  > .desc {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 140%;
    text-align: center;
    color: var(--textSecondary);
    margin-bottom: 24px;
    max-width: 343px;
  }
`;

export default function EmptyOverview() {
  const chain = useChain();
  const isCentrifuge = [Chains.centrifuge, Chains.altair].includes(chain);
  const normalText =
    "Latest events will be displayed on this page. Any ideas? Start a discussion.";

  // Centrifuge request not show discussions on subsquare while they will use self deployed discourse forum.
  const textForCfg = "Latest events will be displayed on this page.";
  const text = isCentrifuge ? textForCfg : normalText;

  return (
    <Wrapper>
      <TitleContainer>Overview</TitleContainer>
      <EmptyPanel>
        <div className="title">Welcome to SubSquare</div>
        <div className="desc">{text}</div>
        {!isCentrifuge && (
          <Link href={"/posts/create"}>
            <PrimaryButton icon={<Icon />}>New Discussion</PrimaryButton>
          </Link>
        )}
      </EmptyPanel>
    </Wrapper>
  );
}
