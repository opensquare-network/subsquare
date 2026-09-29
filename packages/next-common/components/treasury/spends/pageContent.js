import TreasurySpendsPostList from "next-common/components/postList/treasurySpendsPostList";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import useTreasurySpendsList from "next-common/hooks/treasury/useTreasurySpendsList";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import Loading from "next-common/components/loading";
import TreasurySpendsLayout from "next-common/components/treasury/spends/layout";

export default function TreasurySpendsPageContent({ chain }) {
  const { spends: pagedSpends, loading } = useTreasurySpendsList();
  const { items, total, page, pageSize } = pagedSpends;
  const spends = (items || []).map((item) =>
    normalizeTreasurySpendListItem(chain, item),
  );
  const showLoading = loading && !items?.length;

  return (
    <TreasurySpendsLayout>
      <DropdownUrlFilterProvider
        defaultFilterValues={{ status: "", valid_only: false, page: "" }}
        shallow
      >
        {showLoading ? (
          <div className="flex justify-center py-6">
            <Loading size={20} />
          </div>
        ) : (
          <TreasurySpendsPostList
            titleCount={total}
            items={spends}
            pagination={{ page, pageSize, total, shallow: true }}
          />
        )}
      </DropdownUrlFilterProvider>
    </TreasurySpendsLayout>
  );
}
