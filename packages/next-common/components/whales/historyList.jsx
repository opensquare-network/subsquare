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
import { useState } from "react";
import { useRouter } from "next/router";
import Pagination from "../pagination";
import { useUpdateEffect } from "react-use";
import { getReferendaWhalesHistory } from "next-common/services/serverSide/referenda/whales";

export default function WhalesHistoryList() {
  const { historyWhales } = usePageProps();
  const [data, setData] = useState(historyWhales);
  const router = useRouter();

  const page = Number(router.query.page) || 1;

  const columns = [
    addressCol,
    votesPowerCol,
    maxVotedCol,
    ayeNayCol,
    participationCol,
    winRateCol,
  ];

  const rows = data.items.map((whale) => {
    return columns.map((col) => col.cellRender(whale));
  });

  useUpdateEffect(() => {
    getReferendaWhalesHistory(page).then((resp) => {
      if (resp.result) {
        setData(resp.result);
      }
    });
  }, [page]);

  return (
    <div className="space-y-4">
      <TitleContainer>List</TitleContainer>

      <SecondaryCard className="!p-6">
        <WhalesTabs />

        <DataList columns={columns} rows={rows} />

        <Pagination
          shallow
          page={page}
          pageSize={data.pageSize}
          total={data.total}
        />
      </SecondaryCard>
    </div>
  );
}
