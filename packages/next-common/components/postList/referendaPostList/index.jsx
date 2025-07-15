import React from "react";
import { ListWrapper } from "next-common/components/postList/styled";
import MaybeEmpty from "next-common/components/emptyList";
import ListTitleBar from "next-common/components/listTitleBar";
import Pagination from "next-common/components/pagination/index.js";
import businessCategory from "next-common/utils/consts/business/category";
import PostItem from "./postItem";

export default function ReferendaPostList({
  items,
  pagination,
  titleCount,
  titleExtra,
  link,
}) {
  return (
    <ListWrapper>
      <ListTitleBar
        title="List"
        link={link}
        titleCount={titleCount}
        titleExtra={titleExtra}
      />
      <MaybeEmpty items={items} type={businessCategory.openGovReferenda}>
        {items.map((data, index) => (
          <PostItem key={index} data={data} />
        ))}
      </MaybeEmpty>
      <Pagination {...pagination} />
    </ListWrapper>
  );
}
