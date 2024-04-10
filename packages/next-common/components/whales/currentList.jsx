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

export default function WhalesCurrentList() {
  const { whales } = usePageProps();

  const columns = [
    addressCol,
    votesPowerCol,
    tracksCol,
    maxVotedCol,
    ayeNayCol,
    participationCol,
    winRateCol,
  ];

  const rows = whales.items.map((whale) => {
    return columns.map((col) => col.cellRender(whale));
  });

  return <DataList columns={columns} rows={rows} />;
}
