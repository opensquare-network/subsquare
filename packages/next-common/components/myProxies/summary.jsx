import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import LoadableContent from "next-common/components/common/loadableContent";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { useReceivedProxiesContext } from "./context/received";
import { useMyProxiesContext } from "./context/myProxies";

export default function MyProxiesSummary() {
  const { total: myProxiesCount, loading: isMyProxiesLoading } =
    useMyProxiesContext();
  const { total: receivedProxiesCount, loading: isReceivedProxiesLoading } =
    useReceivedProxiesContext();

  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="Proxies">
          <LoadableContent isLoading={isMyProxiesLoading}>
            {myProxiesCount}
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Received">
          <LoadableContent isLoading={isReceivedProxiesLoading}>
            {receivedProxiesCount}
          </LoadableContent>
        </SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
