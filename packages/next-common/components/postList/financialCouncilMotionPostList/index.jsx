import React from "react";
import { ListWrapper } from "next-common/components/postList/styled";
import MaybeEmpty from "next-common/components/emptyList";
import ListTitleBar from "next-common/components/listTitleBar";
import Pagination from "next-common/components/pagination/index.js";
import businessCategory from "next-common/utils/consts/business/category";
import PostItem from "./postItem";

export default function FinancialCouncilMotionPostList({
  items,
  pagination,
  titleCount,
}) {
  return (
    <ListWrapper>
      <ListTitleBar title="List" titleCount={titleCount} />
      <MaybeEmpty items={items} type={businessCategory.financialMotions}>
        {items.map((data, index) => (
          <PostItem key={index} data={data} />
        ))}
      </MaybeEmpty>
      <Pagination {...pagination} />
    </ListWrapper>
  );
}
