import React, { useEffect } from "react";
import { ListWrapper } from "next-common/components/postList/styled";
import MaybeEmpty from "next-common/components/emptyList";
import ReferendaListFilter from "next-common/components/referenda/list/filter";
import ListTitleBar from "next-common/components/listTitleBar";
import Pagination from "next-common/components/pagination/index.js";
import businessCategory from "next-common/utils/consts/business/category";
import NewProposalButton from "next-common/components/summary/newProposalButton";
import PostItem from "./postItem";
import { useRealTimeFiatPrice } from "../common/useValueTransferFiatPrice";
import useFiatPrice from "next-common/hooks/useFiatPrice";

function ListTitle({ isUnVotedOnlyLoading, total }) {
  return (
    <ListTitleBar
      title="List"
      titleCount={isUnVotedOnlyLoading ? "Filtering un-voted..." : total}
      titleExtra={
        <div className="flex items-center gap-x-2">
          <ReferendaListFilter isUnVotedOnlyLoading={isUnVotedOnlyLoading} />
          <NewProposalButton />
        </div>
      }
    />
  );
}

export default function PostList({
  items,
  pagination,
  isUnVotedOnlyLoading,
  total,
}) {
  const { price } = useFiatPrice();
  const [, setPrice] = useRealTimeFiatPrice();
  useEffect(() => {
    setPrice(price);
  }, [price, setPrice]);

  return (
    <ListWrapper>
      <ListTitle isUnVotedOnlyLoading={isUnVotedOnlyLoading} total={total} />
      <MaybeEmpty items={items} type={businessCategory.openGovReferenda}>
        {items.map((data, index) => (
          <PostItem key={index} data={data} />
        ))}
      </MaybeEmpty>
      <Pagination {...pagination} />
    </ListWrapper>
  );
}
