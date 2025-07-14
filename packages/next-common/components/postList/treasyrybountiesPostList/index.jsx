import Pagination from "next-common/components/pagination/index.js";
import ListTitleBar from "../../listTitleBar";
import MaybeEmpty from "next-common/components/emptyList";
import businessCategory from "next-common/utils/consts/business/category";
import { ListWrapper } from "../styled";
import PostItem from "./postItem";

export default function TreasuryBountiesPostList({
  titleCount = null,
  items,
  pagination,
  titleExtra,
}) {
  return (
    <ListWrapper>
      <ListTitleBar
        title="List"
        titleCount={titleCount}
        titleExtra={titleExtra}
        link="/treasury/bounties"
      />
      <MaybeEmpty items={items} type={businessCategory.treasuryBounties}>
        {items.map((data, index) => (
          <PostItem key={index} data={data} />
        ))}
      </MaybeEmpty>
      <Pagination {...pagination} />
    </ListWrapper>
  );
}
