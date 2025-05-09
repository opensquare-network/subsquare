import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import IdentityTimeline from "next-common/components/identityTimeline";
import usePeopleChainIdentityTimeline from "next-common/hooks/people/usePeopleChainIdentityTimeline";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function PeopleOverviewTimeline() {
  const address = useRealAddress();
  const { data, isLoading } = usePeopleChainIdentityTimeline(address);

  return (
    <SecondaryCardDetail>
      <IdentityTimeline timelineData={data} isLoading={isLoading} />
    </SecondaryCardDetail>
  );
}
