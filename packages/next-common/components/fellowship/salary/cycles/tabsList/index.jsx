import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import FellowshipSalaryCycleDetailListTemplate from "./template";
import { useFellowshipSalaryCycleRegistrationsTabItem } from "./registrations";
import { useFellowshipSalaryCycleFeedsTabItem } from "./feeds";
import { useRouter } from "next/router";
import upperFirst from "lodash.upperfirst";

export default function FellowshipSalaryCycleDetailTabsList() {
  const router = useRouter();

  const registrationsTabItem = useFellowshipSalaryCycleRegistrationsTabItem();
  const feedTabItem = useFellowshipSalaryCycleFeedsTabItem();

  const [id] = router.query.params;
  const { tab } = router.query;

  // TODO: sort ongoing or closed
  const items = [registrationsTabItem, feedTabItem];

  const defaultTab = tab ? upperFirst(tab) : items[0]?.label;

  return (
    <PrimaryCard>
      <FellowshipSalaryCycleDetailListTemplate
        items={items}
        defaultTab={defaultTab}
        onTabClick={(tab) => {
          router.replace(
            {
              pathname: `/fellowship/salary/cycles/${id}`,
              query: {
                tab: tab.label,
              },
            },
            undefined,
            {
              shallow: true,
            },
          );
        }}
      />
    </PrimaryCard>
  );
}
