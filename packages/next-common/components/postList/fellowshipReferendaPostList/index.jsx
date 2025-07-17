import React from "react";
import { ListWrapper } from "next-common/components/postList/styled";
import MaybeEmpty from "next-common/components/emptyList";
import ListTitleBar from "next-common/components/listTitleBar";
import Pagination from "next-common/components/pagination/index.js";
import businessCategory from "next-common/utils/consts/business/category";
import PostItem from "./postItem";

export default function FellowshipReferendaPostList({
  items,
  pagination,
  titleCount,
  titleExtra,
}) {
  return (
    <ListWrapper>
      <ListTitleBar
        title="List"
        titleCount={titleCount}
        titleExtra={titleExtra}
        link="/fellowship"
      />
      <MaybeEmpty items={items} type={businessCategory.fellowship}>
        {items.map((data, index) => (
          <PostItem key={index} data={data} />
        ))}
      </MaybeEmpty>
      <Pagination {...pagination} />
    </ListWrapper>
  );
}
