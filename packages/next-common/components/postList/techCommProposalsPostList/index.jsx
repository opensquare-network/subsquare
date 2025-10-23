import Pagination from "next-common/components/pagination/index.js";
import ListTitleBar from "../../listTitleBar";
import MaybeEmpty from "next-common/components/emptyList";
import businessCategory from "next-common/utils/consts/business/category";
import { ListWrapper } from "../styled";
import PostItem from "./postItem";

export default function TechCommProposalsPostList({
  titleCount = null,
  items,
  pagination,
  titleExtra,
  link,
}) {
  return (
    <ListWrapper>
      <ListTitleBar
        title="Tech. Comm. proposals"
        titleCount={titleCount}
        titleExtra={titleExtra}
        link={link}
      />
      <MaybeEmpty items={items} type={businessCategory.tcProposals}>
        {items.map((data, index) => (
          <PostItem key={index} data={data} />
        ))}
      </MaybeEmpty>
      <Pagination {...pagination} />
    </ListWrapper>
  );
}
