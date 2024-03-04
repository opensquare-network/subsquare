import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import FellowshipSalaryCycleDetailListTemplate from "./template";
import { useFellowshipSalaryCycleRegistrationsTabItem } from "./registrations";
import { useFellowshipSalaryCycleFeedsTabItem } from "./feeds";

export default function FellowshipSalaryCycleDetailTabsList() {
  const registrationsTabItem = useFellowshipSalaryCycleRegistrationsTabItem();
  const feedTabItem = useFellowshipSalaryCycleFeedsTabItem();

  // TODO: sort
  const items = [registrationsTabItem, feedTabItem];

  return (
    <PrimaryCard>
      <FellowshipSalaryCycleDetailListTemplate items={items} />
    </PrimaryCard>
  );
}
