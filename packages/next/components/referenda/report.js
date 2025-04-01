import Tooltip from "next-common/components/tooltip";
import Flex from "next-common/components/styled/flex";
import KvList from "next-common/components/listInfo/kvList";
import ExternalLink from "next-common/components/externalLink";
import WarningInfoPanel from "next-common/components/summary/styled/warningInfoPanel";
import useReferendumDetail from "next-common/hooks/referenda/useReferendumDetail";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import {
  SystemTaskDelivered,
  SystemTaskInProgress,
  SystemTaskFlagged,
  SystemWarning,
  SystemLoading,
} from "@osn/icons/subsquare";

const ReportStateIcon = ({ status }) => {
  switch (status) {
    case "Delivered":
      return <SystemTaskDelivered className="w-5 h-5" />;
    case "InProgress":
      return <SystemTaskInProgress className="w-5 h-5" />;
    case "Flagged":
      return <SystemTaskFlagged className="w-5 h-5" />;
  }
};

// task status A:Delivered B:InProgress C:Flagged
const ReportTaskState = ({ status }) => {
  switch (status) {
    case "A":
      return (
        <Tooltip content={"Delivered"} className={"cursor-pointer"}>
          <SystemTaskDelivered className="w-5 h-5" />
        </Tooltip>
      );
    case "B":
      return (
        <Tooltip content={"In Progress"} className={"cursor-pointer"}>
          <SystemTaskInProgress className="w-5 h-5" />
        </Tooltip>
      );
    case "C":
      return (
        <Tooltip content={"Flagged"} className={"cursor-pointer"}>
          <SystemTaskFlagged className="w-5 h-5" />
        </Tooltip>
      );
  }
};

const TaskItem = ({ task }) => {
  return (
    <SecondaryCardDetail className="!p-4">
      <Flex className="justify-between align-top">
        <div className="text-textPrimary font-medium text-sm flex-shrink mr-4">
          {task.title}
        </div>
        <ReportTaskState status={task.status} />
      </Flex>
    </SecondaryCardDetail>
  );
};

export default function ReferendumReport() {
  const { detail, loading } = useReferendumDetail();
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-x-2 text-textTertiary text14Medium">
        <SystemLoading className="w-5 h-5" />
        Fetching...
      </div>
    );
  }
  if (!detail?.id) {
    return (
      <WarningInfoPanel className="justify-center">
        <SystemWarning className="w-5 h-5" />
        {"Warning: can't fetch the content."}
      </WarningInfoPanel>
    );
  }

  const externalLink = `https://app.ogtracker.io/${detail.track || "all"}/${
    detail.refnum
  }`;

  return (
    <>
      <TitleContainer className="!px-0">
        Report
        <ExternalLink className="text14Medium" href={externalLink}>
          OG Tracker
        </ExternalLink>
      </TitleContainer>
      <KvList
        title="Report"
        data={[
          [
            "Status",
            <>
              <ReportStateIcon status={detail.status} />
              <span className="text14Medium text-textPrimary">
                {detail.status}
              </span>
            </>,
          ],
          [
            "Category",
            <>
              <span className="text14Medium text-textPrimary">
                {detail.category}
              </span>
              ,
            </>,
          ],
        ]}
        showFold={true}
      />
      <TitleContainer className="!px-0">
        <h2>
          Task
          <span className="ml-1 text14Medium text-textTertiary">
            {detail?.tasks?.length || 0}
          </span>
        </h2>
      </TitleContainer>
      {detail?.tasks?.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </>
  );
}
