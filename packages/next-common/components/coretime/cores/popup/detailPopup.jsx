import Popup from "next-common/components/popup/wrapper/Popup";
import { isNil, noop } from "lodash-es";
import { MapDataList } from "next-common/components/dataList";
import { useWorkplanColumnsDef } from "../hooks/useColumnsDef";

export default function CoreDetailPopup({ core, onClose = noop }) {
  const columnsDef = useWorkplanColumnsDef();
  if (isNil(core)) {
    return null;
  }

  return (
    <Popup title={`Core #${core.coreIndex}`} onClose={onClose}>
      <MapDataList
        columnsDef={columnsDef}
        data={core.workplans}
        loading={false}
        noDataText="No workplan"
      />
    </Popup>
  );
}
