import { usePageProps } from "next-common/context/page";
import DataList from "../dataList";
import {
  addressCol,
  ayeNayCol,
  maxVotedCol,
  participationCol,
  votesPowerCol,
  winRateCol,
} from "./columns";
import { SecondaryCard } from "../styled/containers/secondaryCard";
import { TitleContainer } from "../styled/containers/titleContainer";
import WhalesTabs from "./tabs";

export default function WhalesHistoryList() {
  const { historyWhales } = usePageProps();

  const columns = [
    addressCol,
    votesPowerCol,
    maxVotedCol,
    ayeNayCol,
    participationCol,
    winRateCol,
  ];

  const rows = historyWhales.items.map((whale) => {
    return columns.map((col) => col.cellRender(whale));
  });

  return (
    <div className="space-y-4">
      <TitleContainer>List</TitleContainer>

      <SecondaryCard className="!p-6">
        <WhalesTabs />

        <DataList columns={columns} rows={rows} />
      </SecondaryCard>
    </div>
  );
}
