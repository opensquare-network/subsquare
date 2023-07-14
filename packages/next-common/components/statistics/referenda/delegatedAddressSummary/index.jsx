import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import DelegatedAddressChart from "./delegatedAddressChart";
import { StatisticsTitle } from "../../styled";

export default function DelegatedAddressSummary({ tracks }) {
  return (
    <SecondaryCard>
      <StatisticsTitle>Delegated Addr</StatisticsTitle>
      <DelegatedAddressChart tracks={tracks} />
    </SecondaryCard>
  );
}
