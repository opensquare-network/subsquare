import { usePageProps } from "next-common/context/page";
import { getReferendaWhalesHistory } from "next-common/services/serverSide/referenda/whales";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUpdateEffect } from "react-use";
import DataList from "../dataList";
import Pagination from "../pagination";
import { SecondaryCard } from "../styled/containers/secondaryCard";
import { TitleContainer } from "../styled/containers/titleContainer";
import { addressCol } from "./columns/addressCol";
import { ayeNayCol } from "./columns/ayeNayCol";
import { maxVotedCol } from "./columns/maxVotedCol";
import { participationCol } from "./columns/participationCol";
import { votesPowerCol } from "./columns/votesPowerCol";
import { winRateCol } from "./columns/winRateCol";
import WhalesTabs from "./tabs";

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
    getReferendaWhalesHistory(page, 25).then((resp) => {
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

        <hr />

        <DataList className="mt-4" columns={columns} rows={rows} />

        <div className="mt-2">
          <Pagination
            shallow
            page={page}
            pageSize={data.pageSize}
            total={data.total}
          />
        </div>
      </SecondaryCard>
    </div>
  );
}
