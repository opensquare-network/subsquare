import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import FellowshipSalaryCycleDetailListTemplate from "./template";
import { useFellowshipSalaryCycleRegistrationsTabItem } from "./registrations";
import { useFellowshipSalaryCycleFeedsTabItem } from "./feeds";
import { useRouter } from "next/router";
import { find } from "lodash-es";
import { useFellowshipSalaryCyclePaymentsTabItem } from "./payments";
import { usePageProps } from "next-common/context/page";
import { useUrlSearchParams } from "next-common/hooks/useUrlSearchParams";

export default function FellowshipSalaryCycleDetailTabsList() {
  const router = useRouter();
  const { cycle } = usePageProps();
  const [, , updateSearchParams] = useUrlSearchParams();

  const registrationsTabItem = useFellowshipSalaryCycleRegistrationsTabItem();
  const paymentsTabItem = useFellowshipSalaryCyclePaymentsTabItem();
  const feedTabItem = useFellowshipSalaryCycleFeedsTabItem();

  const { tab = "" } = router.query;

  const items = cycle?.isFinal
    ? [paymentsTabItem, registrationsTabItem, feedTabItem]
    : [registrationsTabItem, paymentsTabItem, feedTabItem];

  const matchedTabItem = find(
    items,
    (i) => i.name.toLowerCase() === tab?.toLowerCase?.(),
  );

  const defaultTabValue = matchedTabItem?.name || items[0]?.name;

  return (
    <PrimaryCard>
      <FellowshipSalaryCycleDetailListTemplate
        items={items}
        defaultTabValue={defaultTabValue}
        onTabClick={(tab) => {
          updateSearchParams({ tab: tab.value?.toLowerCase?.() });
        }}
      />
    </PrimaryCard>
  );
}
