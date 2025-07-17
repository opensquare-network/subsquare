import Pagination from "next-common/components/pagination/index.js";
import ListTitleBar from "next-common/components/listTitleBar";
import MaybeEmpty from "next-common/components/emptyList";
import businessCategory from "next-common/utils/consts/business/category";
import { ListWrapper } from "next-common/components/postList/styled";
import PostItem from "./postItem";

export default function DemocracyPublicProposalsPostList({
  titleCount = null,
  items,
  pagination,
  titleExtra,
  link,
}) {
  return (
    <ListWrapper>
      <ListTitleBar
        titleExtra={titleExtra}
        title="List"
        titleCount={titleCount}
        link={link}
      />
      <MaybeEmpty items={items} type={businessCategory.democracyProposals}>
        {items.map((data, index) => (
          <PostItem key={index} data={data} />
        ))}
      </MaybeEmpty>
      <Pagination {...pagination} />
    </ListWrapper>
  );
}
