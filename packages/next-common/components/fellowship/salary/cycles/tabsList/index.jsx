import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import FellowshipSalaryCycleDetailListTemplate from "./template";
import { useFellowshipSalaryCycleRegistrationsTabItem } from "./registrations";
import { useFellowshipSalaryCycleFeedsTabItem } from "./feeds";
import { useRouter } from "next/router";
import find from "lodash.find";

export default function FellowshipSalaryCycleDetailTabsList() {
  const router = useRouter();

  const registrationsTabItem = useFellowshipSalaryCycleRegistrationsTabItem();
  const feedTabItem = useFellowshipSalaryCycleFeedsTabItem();

  const [id] = router.query.params;
  const { tab = "" } = router.query;

  // TODO: sort ongoing or closed
  const items = [registrationsTabItem, feedTabItem];

  const matchedTabItem = find(
    items,
    (i) => i.name.toLowerCase() === tab?.toLowerCase?.(),
  );

  const defaultTab = matchedTabItem?.name || items[0]?.name;

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
