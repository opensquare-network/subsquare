import ListTitleBar from "next-common/components/listTitleBar";
import Tooltip from "next-common/components/tooltip";
import { usePageProps } from "next-common/context/page";
import { noop } from "lodash-es";
import ViewTypeTabs from "./viewTypeTabs";

export default function HeaderBar({ selectedTabId, setSelectedTabId = noop }) {
  const { projects = [] } = usePageProps();
  return (
    <ListTitleBar
      title={
        <span className="inline-flex items-center gap-x-1">
          Projects
          <Tooltip content="The prices are calculated at awarded time."></Tooltip>
        </span>
      }
      titleCount={projects.length}
      titleExtra={
        <ViewTypeTabs
          selectedTabId={selectedTabId}
          setSelectedTabId={setSelectedTabId}
        />
      }
    />
  );
}
