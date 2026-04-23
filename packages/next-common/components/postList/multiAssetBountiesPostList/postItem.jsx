import React from "react";
import {
  Wrapper,
  Footer,
  FooterWrapper,
  HeadWrapper,
  ContentWrapper,
  TitleExtra,
  TitleExtraValue,
} from "next-common/components/postList/styled";
import {
  PostItemBanner,
  PostItemTitle,
  PostItemUser,
  PostItemTime,
  PostItemCommentCount,
  PostItemMalicious,
  PostItemAISummary,
} from "next-common/components/postList/common";
import Divider from "next-common/components/styled/layout/divider";
import { MultiAssetBountyTag } from "next-common/components/tags/state/treasury";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";

function MultiAssetBountyValue({ value, assetKind }) {
  const { decimals: chainDecimals, symbol: chainSymbol } = useChainSettings();
  const { symbol, decimals } = getAssetInfoFromAssetKind(
    assetKind,
    chainDecimals,
    chainSymbol,
  );

  if (value == null) return null;

  return (
    <TitleExtra>
      <TitleExtraValue>
        <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />
      </TitleExtraValue>
    </TitleExtra>
  );
}

export default function PostItem({ data }) {
  return (
    <Wrapper>
      <ContentWrapper>
        <HeadWrapper>
          <PostItemTitle data={data} href={data?.detailLink} />
          <MultiAssetBountyValue
            value={data?.value}
            assetKind={data?.assetKind}
          />
        </HeadWrapper>
        <Divider margin={12} />
        <FooterWrapper>
          <Footer>
            <PostItemUser data={data} />
            <PostItemTime data={data} />
            <PostItemCommentCount data={data} />
            <PostItemMalicious isMalicious={data?.isMalicious} />
            <PostItemAISummary data={data} />
          </Footer>
          <MultiAssetBountyTag state={data.status} />
        </FooterWrapper>
      </ContentWrapper>
      <PostItemBanner bannerCid={data?.bannerCid} />
    </Wrapper>
  );
}
