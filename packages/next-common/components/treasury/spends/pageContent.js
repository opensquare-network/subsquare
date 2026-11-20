import TreasurySpendsPostList from "next-common/components/postList/treasurySpendsPostList";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import useTreasurySpendsList from "next-common/hooks/treasury/useTreasurySpendsList";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import TreasurySpendsLayout from "next-common/components/treasury/spends/layout";

export default function TreasurySpendsPageContent({ chain }) {
  const { spends: pagedSpends, loading } = useTreasurySpendsList();
  const { items, total, page, pageSize } = pagedSpends;
  const spends = (items || []).map((item) =>
    normalizeTreasurySpendListItem(chain, item),
  );

  return (
    <TreasurySpendsLayout>
      <DropdownUrlFilterProvider
        defaultFilterValues={{
          status: "",
          symbol: "",
          valid_only: false,
          page: "",
        }}
        shallow
      >
        <TreasurySpendsPostList
          titleCount={total}
          items={spends}
          loading={loading}
          pagination={{ page, pageSize, total, shallow: true }}
        />
      </DropdownUrlFilterProvider>
    </TreasurySpendsLayout>
  );
}
