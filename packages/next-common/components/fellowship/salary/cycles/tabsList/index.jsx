import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import FellowshipSalaryCycleDetailListTemplate from "./template";
import { useFellowshipSalaryCycleRegistrationsTabItem } from "./registrations";

export default function FellowshipSalaryCycleDetailTabsList() {
  const registrationsItem = useFellowshipSalaryCycleRegistrationsTabItem();

  // TODO: sort
  const items = [registrationsItem];

  return (
    <PrimaryCard>
      <FellowshipSalaryCycleDetailListTemplate items={items} />
    </PrimaryCard>
  );
}
