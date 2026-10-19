import Pagination from "next-common/components/pagination/index.js";
import ListTitleBar from "../../listTitleBar";
import TreasurySpendFilter from "next-common/components/treasury/spends/treasurySpendFilter";
import MaybeEmpty from "next-common/components/emptyList";
import Loading from "next-common/components/loading";
import businessCategory from "next-common/utils/consts/business/category";
import { ListWrapper } from "../styled";
import PostItem from "./postItem";

export default function PostList({
  titleCount = null,
  items,
  loading = false,
  pagination,
}) {
  const showLoading = loading && !items?.length;

  return (
    <ListWrapper>
      <ListTitleBar
        title="List"
        link="/treasury/spends"
        titleCount={titleCount}
        titleExtra={<TreasurySpendFilter loading={loading} />}
      />
      {showLoading ? (
        <div className="flex justify-center py-6">
          <Loading size={20} />
        </div>
      ) : (
        <>
          <MaybeEmpty items={items} type={businessCategory.treasurySpends}>
            {items.map((data, index) => (
              <PostItem key={index} data={data} />
            ))}
          </MaybeEmpty>
          <Pagination {...pagination} />
        </>
      )}
    </ListWrapper>
  );
}
