import Tooltip from "next-common/components/tooltip";
import Flex from "next-common/components/styled/flex";
import KvList from "next-common/components/listInfo/kvList";
import ExternalLink from "next-common/components/externalLink";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import {
  SystemTaskDelivered,
  SystemTaskInProgress,
  SystemTaskFlagged,
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

export default function ReferendumReport({ detail }) {
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
              <span className="text14Medium text-textPrimary mr-2">
                {detail.status}
              </span>
              <ReportStateIcon status={detail.status} />
            </>,
          ],
          [
            "Category",
            <>
              <span className="text14Medium text-textPrimary">
                {detail.category}
              </span>
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
