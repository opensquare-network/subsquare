import LoadableContent from "next-common/components/common/loadableContent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { useProfileMultisigsDataContext } from "next-common/components/profile/multisigs/context/profileMultisigsDataContext";

export default function MultisigSummary() {
  const { data, loading } = useProfileMultisigsDataContext();

  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="Threshold">
          <LoadableContent isLoading={loading}>
            {data?.threshold || 0}
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Signatories">
          <LoadableContent isLoading={loading}>
            {data?.signatories?.length || 0}
          </LoadableContent>
        </SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
