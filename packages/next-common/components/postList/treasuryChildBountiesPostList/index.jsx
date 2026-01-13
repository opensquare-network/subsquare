import Pagination from "next-common/components/pagination/index.js";
import ListTitleBar from "../../listTitleBar";
import TreasuryChildBountyFilter from "next-common/components/treasury/childBounties/treasuryChildBountyFilter";
import MaybeEmpty from "next-common/components/emptyList";
import businessCategory from "next-common/utils/consts/business/category";
import { ListWrapper } from "../styled";
import PostItem from "./postItem";

export default function TreasuryChildBountiesPostList({
  titleCount = null,
  items,
  pagination,
}) {
  return (
    <ListWrapper>
      <ListTitleBar
        title="List"
        titleCount={titleCount}
        link="/treasury/child-bounties"
        titleExtra={<TreasuryChildBountyFilter />}
      />
      <MaybeEmpty items={items} type={businessCategory.treasuryChildBounties}>
        {items.map((data, index) => (
          <PostItem key={index} data={data} />
        ))}
      </MaybeEmpty>
      <Pagination {...pagination} />
    </ListWrapper>
  );
}
