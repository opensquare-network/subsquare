import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import useProfileAddress from "../useProfileAddress";
import LoadableContent from "next-common/components/common/loadableContent";

export default function ProfileTreasurySummary() {
  const address = useProfileAddress();
  const { value, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch(
      `treasury/beneficiaries/${address}`,
    );
    return result;
  }, [address]);

  if (!value) {
    return null;
  }

  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="Award value">
          <LoadableContent isLoading={loading}>
            <ValueDisplay
              value={value?.totalBenefitFiatValue}
              symbol=""
              prefix="$"
            />
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Rank">1</SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
