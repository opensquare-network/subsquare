import { getDemocracyMenu } from "next-common/utils/consts/menu/democracy";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import { profileDemocracyDepositsSelector } from "next-common/store/reducers/profile/deposits/democracy";
import { useDemocracyTableItems } from "next-common/components/myDeposits/democracy";

export default function useProfileDemocracyDepositsData() {
  const menu = getDemocracyMenu();
  menu.pathname = menu.items[0].pathname;

  const deposits = useSelector(profileDemocracyDepositsSelector);
  const loading = isNil(deposits);
  const items = useDemocracyTableItems(deposits);

  return {
    ...menu,
    activeCount: deposits?.length || 0,
    items,
    loading,
  };
}
