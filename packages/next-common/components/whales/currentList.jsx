import { usePageProps } from "next-common/context/page";
import DataList from "../dataList";
import {
  addressCol,
  ayeNayCol,
  maxVotedCol,
  participationCol,
  tracksCol,
  votesPowerCol,
  winRateCol,
} from "./columns";
import { SecondaryCard } from "../styled/containers/secondaryCard";
import { TitleContainer } from "../styled/containers/titleContainer";
import Pagination from "../pagination";
import WhalesTabs from "./tabs";
import { useRouter } from "next/router";
import { useUpdateEffect } from "react-use";
import { useState } from "react";
import { getReferendaWhales } from "next-common/services/serverSide/referenda/whales";

export default function WhalesCurrentList() {
  const { whales } = usePageProps();
  const [data, setData] = useState(whales);
  const router = useRouter();

  const page = Number(router.query.page) || 1;

  const columns = [
    addressCol,
    votesPowerCol,
    tracksCol,
    maxVotedCol,
    ayeNayCol,
    participationCol,
    winRateCol,
  ];

  const rows = data.items.map((whale) => {
    return columns.map((col) => col.cellRender(whale));
  });

  useUpdateEffect(() => {
    getReferendaWhales(page).then((resp) => {
      if (resp.result) {
        setData(resp.result);
      }
    });
  }, [page]);

  return (
    <div className="space-y-4">
      <TitleContainer>List</TitleContainer>

      <SecondaryCard className="!p-6 space-y-4">
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
