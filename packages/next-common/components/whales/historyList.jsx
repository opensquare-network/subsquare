import {
  fetchReferendaWhales,
  fetchReferendaWhalesHistory,
} from "next-common/services/serverSide/referenda/whales";
import { useRouter } from "next/router";
import { useAsync } from "react-use";
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
import { defaultPageSize } from "next-common/utils/constants";

export default function WhalesHistoryList() {
  const router = useRouter();
  const page = Number(router.query.page) || 1;

  const { value: currentData } = useAsync(async () => {
    return fetchReferendaWhales(1, 1).then((resp) => {
      if (resp.result) {
        return resp.result;
      }
    });
  }, [page]);

  const { value: historyData, loading } = useAsync(async () => {
    return fetchReferendaWhalesHistory(page, defaultPageSize).then((resp) => {
      if (resp.result) {
        return resp.result;
      }
    });
  }, [page]);

  const columns = [
    addressCol,
    votesPowerCol,
    maxVotedCol,
    ayeNayCol,
    participationCol,
    winRateCol,
  ];

  const rows = historyData?.items?.map?.((whale) => {
    return columns.map((col) => col.cellRender(whale));
  });

  return (
    <div className="space-y-4">
      <TitleContainer>List</TitleContainer>

      <SecondaryCard className="!p-6">
        <WhalesTabs
          currentCount={currentData?.total}
          historyCount={historyData?.total}
        />

        <hr />

        <DataList
          className="mt-4"
          columns={columns}
          rows={rows}
          loading={loading}
        />

        <div className="mt-2">
          <Pagination
            shallow
            page={page}
            pageSize={historyData?.pageSize}
            total={historyData?.total}
          />
        </div>
      </SecondaryCard>
    </div>
  );
}
