import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import FellowshipSalaryCycleDetailListTemplate from "next-common/components/fellowship/salary/cycles/tabsList/template";
import { useSecretarySalaryCycleRegistrationsTabItem } from "./registrations";
import { useSecretarySalaryCycleFeedsTabItem } from "./feeds";
import { useRouter } from "next/router";
import { find } from "lodash-es";
import { useSecretarySalaryCyclePaymentsTabItem } from "./payments";
import { usePageProps } from "next-common/context/page";
import { useUrlSearchParams } from "next-common/hooks/useUrlSearchParams";

export default function SecretarySalaryCycleDetailTabsList() {
  const router = useRouter();
  const { cycle } = usePageProps();
  const [, , updateSearchParams] = useUrlSearchParams();

  const registrationsTabItem = useSecretarySalaryCycleRegistrationsTabItem();
  const paymentsTabItem = useSecretarySalaryCyclePaymentsTabItem();
  const feedTabItem = useSecretarySalaryCycleFeedsTabItem();

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
