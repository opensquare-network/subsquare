import Pagination from "next-common/components/pagination/index.js";
import ListTitleBar from "../../../listTitleBar";
import MaybeEmpty from "next-common/components/emptyList";
import businessCategory from "next-common/utils/consts/business/category";
import { ListWrapper } from "../../styled";
import PostItem from "./postItem";
import NewBountyButton from "next-common/components/treasury/bounty/newBountyButton";

export default function TreasuryBountiesPostList({
  titleCount = null,
  items,
  pagination,
}) {
  return (
    <ListWrapper>
      <ListTitleBar
        title="List"
        titleCount={titleCount}
        titleExtra={<NewBountyButton />}
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
