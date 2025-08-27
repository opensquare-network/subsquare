import { MapDataList } from "next-common/components/dataList";
import { useMergedJudgementsData } from "next-common/components/people/overview/hooks/useJudgementsData";
import {
  colRegistrar,
  colStatus,
} from "next-common/components/people/overview/judgements/columns";
import { useSpecifyApiRegistrarsList } from "next-common/utils/hooks/useRegistrarsList";
import { usePeopleApi } from "next-common/context/people/api";

const columnsDef = [colRegistrar, colStatus];

export default function Judgements({ judgements, isLoading: _isLoading }) {
  const api = usePeopleApi();
  const registrarsResult = useSpecifyApiRegistrarsList(api);
  const { data, isLoading } = useMergedJudgementsData(
    { judgements, isLoading: _isLoading },
    registrarsResult,
  );

  return (
    <MapDataList
      columnsDef={columnsDef}
      data={data}
      loading={isLoading}
      noDataText="No current judgements"
    />
  );
}
