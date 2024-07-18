import SummaryLayout from "next-common/components/summary/layout/layout";
import { TotalBalance, Transferrable } from "./accountBalances";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableItem from "./loadableItem";

function FellowshipMember() {
  return (
    <SummaryItem title="Fellowship Member">
      <LoadableItem value={0} isLoading={false} />
    </SummaryItem>
  );
}

function AmbassadorMember() {
  return (
    <SummaryItem title="Ambassador Member">
      <LoadableItem value={0} isLoading={false} />
    </SummaryItem>
  );
}

export default function CollectivesAccountInfo() {
  return (
    <SummaryLayout>
      <TotalBalance />
      <Transferrable />
      <FellowshipMember />
      <AmbassadorMember />
    </SummaryLayout>
  );
}
