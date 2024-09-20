import { getDemocracyMenu } from "next-common/utils/consts/menu/democracy";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import { profileDemocracyDepositsSelector } from "next-common/store/reducers/profile/deposits/democracy";
import { useDemocracyTableItems } from "next-common/components/myDeposits/democracy";
import { useChainSettings } from "next-common/context/chain";

export default function useProfileDemocracyDepositsData() {
  const {
    modules: { democracy },
  } = useChainSettings();

  const deposits = useSelector(profileDemocracyDepositsSelector);
  const loading = isNil(deposits);
  const items = useDemocracyTableItems(deposits);

  if (!democracy) {
    return null;
  }

  const menu = getDemocracyMenu();
  menu.pathname = menu.items[0].pathname;

  return {
    ...menu,
    activeCount: deposits?.length || 0,
    items,
    loading,
  };
}
