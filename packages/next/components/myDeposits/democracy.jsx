import sumBy from "lodash.sumby";
import ActiveProposalTemplate from "next-common/components/overview/activeProposals/activeProposalTemplate";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "next-common/components/overview/activeProposals/columns";
import useFetchMyDemocracyDeposits from "next-common/hooks/account/deposit/useFetchMyDemocracyDeposits";
import { myDemocracyDepositsSelector } from "next-common/store/reducers/myOnChainData/deposits/myDemocracyDeposits";
import businessCategory from "next-common/utils/consts/business/category";
import { getDemocracyMenu } from "next-common/utils/consts/menu/democracy";
import { useSelector } from "react-redux";

export default function MyDemocracyDeposits() {
  useFetchMyDemocracyDeposits();

  const deposits = useSelector(myDemocracyDepositsSelector);
  console.log(deposits);

  const menu = getDemocracyMenu();

  const items = [
    {
      name: "Public Proposal Deposits",
      activeCount: deposits?.length || 0,
      columns: [
        getProposalPostTitleColumn(),
        {
          name: "Reservation",
          className: "w-40 text-right",
          cellRender() {},
        },
        getStatusTagColumn({ category: businessCategory.democracyProposals }),
      ],
    },
  ];
  const activeCount = sumBy(items, "activeCount");

  return (
    <div>
      <ActiveProposalTemplate
        {...menu}
        activeCount={activeCount}
        items={items}
      />
    </div>
  );
}
