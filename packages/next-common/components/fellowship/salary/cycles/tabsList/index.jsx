import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import FellowshipSalaryCycleDetailListTemplate from "./template";
import { useFellowshipSalaryCycleRegistrationsTabItem } from "./registrations";
import { useFellowshipSalaryCycleFeedsTabItem } from "./feeds";
import { useRouter } from "next/router";
import find from "lodash.find";
import { useFellowshipSalaryCyclePaymentsTabItem } from "./payments";
import { usePageProps } from "next-common/context/page";

export default function FellowshipSalaryCycleDetailTabsList() {
  const router = useRouter();
  const { cycle } = usePageProps();

  const registrationsTabItem = useFellowshipSalaryCycleRegistrationsTabItem();
  const paymentsTabItem = useFellowshipSalaryCyclePaymentsTabItem();
  const feedTabItem = useFellowshipSalaryCycleFeedsTabItem();

  const [id] = router.query.params;
  const { tab = "" } = router.query;

  const items = cycle?.isFinal
    ? [paymentsTabItem, registrationsTabItem, feedTabItem]
    : [registrationsTabItem, paymentsTabItem, feedTabItem];

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
                tab: tab.label?.toLowerCase?.(),
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
