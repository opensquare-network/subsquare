import Popup from "next-common/components/popup/wrapper/Popup";
import { isNil, noop } from "lodash-es";
import pluralize from "pluralize";
import ListTitleBar from "next-common/components/listTitleBar";
import { MapDataList } from "next-common/components/dataList";
import { useWorkplanColumnsDef } from "../hooks/useColumnsDef";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import CoretimeCoresTag from "next-common/components/tags/state/coretimeCores";
import TimeColumn from "../table/timeColumn";
import TaskColumn from "../table/taskColumn";
import { TimeHeaderButton } from "../hooks/useColumnsDef";

export default function CoreDetailPopup({ core, onClose = noop }) {
  const columnsDef = useWorkplanColumnsDef();
  if (isNil(core)) {
    return null;
  }

  return (
    <Popup title={`Core #${core.coreIndex}`} onClose={onClose}>
      <SummaryLayout className="text-textPrimary">
        <SummaryItem title="Task">
          <div className="text-textPrimary text14Medium">
            <TaskColumn item={core} />
          </div>
        </SummaryItem>
        <SummaryItem
          title={<TimeHeaderButton name="Start time" timeName="Start age" />}
        >
          <div className="text-textPrimary text14Medium">
            <TimeColumn height={core.startRelayBlock} />
          </div>
        </SummaryItem>
        <SummaryItem
          title={<TimeHeaderButton name="End time" timeName="End age" />}
        >
          <div className="text-textPrimary text14Medium">
            <TimeColumn height={core.endRelayBlock} />
          </div>
        </SummaryItem>
        <SummaryItem title="Type">
          <CoretimeCoresTag state={core.occupancyType} />
        </SummaryItem>
      </SummaryLayout>

      <ListTitleBar
        titleContainerClassName="!pl-0"
        className="text14Bold"
        title={pluralize("workplan", core.workplans.length)}
        titleCount={core.workplans.length}
      />

      <MapDataList
        columnsDef={columnsDef}
        data={core.workplans}
        loading={false}
        noDataText="No workplan"
      />
    </Popup>
  );
}
