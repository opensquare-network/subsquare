import Pagination from "next-common/components/pagination/index.js";
import ListTitleBar from "../../../listTitleBar";
import TreasurySpendFilter from "next-common/components/treasury/spends/treasurySpendFilter";
import MaybeEmpty from "next-common/components/emptyList";
import businessCategory from "next-common/utils/consts/business/category";
import { ListWrapper } from "../../styled";
import PostItem from "./postItem";

export default function PostList({ titleCount = null, items, pagination }) {
  return (
    <ListWrapper>
      <ListTitleBar
        title="List"
        titleCount={titleCount}
        titleExtra={<TreasurySpendFilter />}
      />
      <MaybeEmpty items={items} type={businessCategory.treasurySpends}>
        {items.map((data, index) => (
          <PostItem key={index} data={data} />
        ))}
      </MaybeEmpty>
      <Pagination {...pagination} />
    </ListWrapper>
  );
}
