import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Divider from "next-common/components/styled/layout/divider";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useMyCoretime from "./useMyCoretime";
import MyCoretimeSummaryItems from "./summaryItems";

function MyCoretimeContent() {
  const { summary, loading } = useMyCoretime();

  return (
    <NeutralPanel className="p-6 text-textPrimary">
      <h3 className="text16Bold">My Coretime</h3>
      <Divider className="my-4" />
      <MyCoretimeSummaryItems summary={summary} loading={loading} />
    </NeutralPanel>
  );
}

export default function CoretimeMyCoretime() {
  const address = useRealAddress();

  if (!address) {
    return null;
  }

  return <MyCoretimeContent />;
}
