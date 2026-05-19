import { MapDataList } from "next-common/components/dataList";
import { useStakingNominationsValidatorColumn } from "./columns/validator";
import { useStakingNominationsSelfStakeColumn } from "./columns/selfStake";
import { useStakingNominationsTotalStakeColumn } from "./columns/totalStake";
import { useStakingNominationsNominatorCountColumn } from "./columns/nominatorCount";
import { useStakingNominationsCommissionColumn } from "./columns/commission";
import { useStakingNominationsMyShareColumn } from "./columns/myShare";
import { useStakingNominationsActiveColumn } from "./columns/active";
import useStakingNominations from "./useStakingNominations";

function useColumnsDef() {
  const validatorColumn = useStakingNominationsValidatorColumn();
  const selfStakeColumn = useStakingNominationsSelfStakeColumn();
  const totalStakeColumn = useStakingNominationsTotalStakeColumn();
  const nominatorCountColumn = useStakingNominationsNominatorCountColumn();
  const commissionColumn = useStakingNominationsCommissionColumn();
  const myShareColumn = useStakingNominationsMyShareColumn();
  const activeColumn = useStakingNominationsActiveColumn();

  return [
    validatorColumn,
    selfStakeColumn,
    totalStakeColumn,
    nominatorCountColumn,
    commissionColumn,
    myShareColumn,
    activeColumn,
  ];
}

export default function StakingNominationsList({ address }) {
  const columnsDef = useColumnsDef();
  const { list, loading } = useStakingNominations(address);

  return (
    <MapDataList
      columnsDef={columnsDef}
      data={list}
      loading={loading}
      noDataText="No nominations"
    />
  );
}
