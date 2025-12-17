import { LABELS } from "../const";
import ValueDisplay from "next-common/components/valueDisplay";
import useProjectChartInteraction from "./useProjectChartInteraction";
import { usePageProps } from "next-common/context/page";

export default function useTableViewColumnsDef() {
  const columnsDef = [
    {
      name: "Name",
      render: (item) => <ProjectNameColumn item={item} />,
    },
    {
      name: "Category",
      style: {
        width: "220px",
        textAlign: "right",
      },
      render: (item) => (
        <span className="text-textTertiary">{LABELS[item.category]}</span>
      ),
    },
    {
      name: "Request",
      style: {
        width: "160px",
        textAlign: "right",
      },
      render: (item) => (
        <ValueDisplay value={item.fiatAtFinal} symbol="" prefix="$" />
      ),
    },
  ];

  return columnsDef;
}

function ProjectNameColumn({ item }) {
  const { projects = [] } = usePageProps();
  const { handleProjectClick, ProjectProposalsPopup } =
    useProjectChartInteraction(projects);

  return (
    <>
      <div
        className="text-textPrimary cursor-pointer hover:underline"
        onClick={() => handleProjectClick(item.name)}
      >
        {item.name}
      </div>
      {ProjectProposalsPopup}
    </>
  );
}
