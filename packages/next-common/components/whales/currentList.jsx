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
import { tracksCol } from "./columns/tracksCol";
import { votesPowerCol } from "./columns/votesPowerCol";
import { winRateCol } from "./columns/winRateCol";
import WhalesTabs from "./tabs";
import { defaultPageSize } from "next-common/utils/constants";

export default function WhalesCurrentList() {
  const router = useRouter();
  const page = Number(router.query.page) || 1;

  const { value: currentData, loading } = useAsync(async () => {
    return fetchReferendaWhales(page, defaultPageSize).then((resp) => {
      if (resp.result) {
        return resp.result;
      }
    });
  }, [page]);

  const { value: historyData } = useAsync(async () => {
    return fetchReferendaWhalesHistory(1, 1).then((resp) => {
      if (resp.result) {
        return resp.result;
      }
    });
  }, []);

  const columns = [
    addressCol,
    votesPowerCol,
    tracksCol,
    maxVotedCol,
    ayeNayCol,
    participationCol,
    winRateCol,
  ];

  const rows = currentData?.items?.map?.((whale) => {
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
            pageSize={currentData?.pageSize}
            total={currentData?.total}
          />
        </div>
      </SecondaryCard>
    </div>
  );
}
