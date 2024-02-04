import React from "react";
import { toPrecision } from "next-common/utils";
import isNil from "lodash.isnil";
import { getBannerUrl } from "next-common/utils/banner";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import ListPostTitle from "next-common/components/postList/postTitle";
import PostListItemLayout from "./postListItemLayout";
import { TitleExtra, TitleExtraValue } from "./styled";
import ItemFooter from "./footer";

function ItemTitleExtra({ data }) {
  const { decimals, symbol } = useChainSettings();
  if (!data) {
    return;
  }

  const method = data?.onchainData?.proposal?.method;

  const postValue = data.onchainData?.isTreasury
    ? data.onchainData?.treasuryInfo?.amount
    : data.value;

  if (isNil(postValue)) {
    if (!method) {
      return;
    }

    return <TitleExtra>{method}</TitleExtra>;
  }

  return (
    <TitleExtra>
      <TitleExtraValue>
        <ValueDisplay
          value={toPrecision(postValue, decimals)}
          symbol={symbol}
        />
      </TitleExtraValue>
    </TitleExtra>
  );
}

export default function PostListItem({ data, href, type }) {
  const bannerUrl = getBannerUrl(data.bannerCid);

  return (
    <PostListItemLayout
      title={<ListPostTitle data={data} href={href} />}
      titleExtra={<ItemTitleExtra data={data} />}
      footer={<ItemFooter data={data} type={type} />}
      banner={bannerUrl && <img src={bannerUrl} alt="banner image" />}
    />
  );
}
