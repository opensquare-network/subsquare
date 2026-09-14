import Labeled from "next-common/components/Labeled";
import { useContextApi } from "next-common/context/api";
import { usePageProps } from "next-common/context/page";
import { RegionTimeProvider } from "../regions/context";
import RegionTimeColumn from "../regions/timeColumn";

export default function RenewalTimeRange() {
  const api = useContextApi();
  const { coretimeSale } = usePageProps();
  const sale = coretimeSale?.info;
  const timeslicePeriod = api?.consts.broker?.timeslicePeriod?.toNumber();

  const startHeight =
    timeslicePeriod && sale ? sale.regionBegin * timeslicePeriod : null;
  const endHeight =
    timeslicePeriod && sale ? sale.regionEnd * timeslicePeriod : null;

  return (
    <RegionTimeProvider>
      <Labeled text="Start time">
        <RegionTimeColumn height={startHeight} />
      </Labeled>
      <Labeled text="End time">
        <RegionTimeColumn height={endHeight} />
      </Labeled>
    </RegionTimeProvider>
  );
}
