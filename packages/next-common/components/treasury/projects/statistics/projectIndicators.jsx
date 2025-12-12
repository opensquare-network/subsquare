import { formatNum } from "next-common/utils";
import useProjectChartInteraction from "../hooks/useProjectChartInteraction";

export default function ProjectIndicators({ data, projects = [] }) {
  const { handleProjectClick, ProjectProposalsPopup } =
    useProjectChartInteraction(projects);

  if (!data) {
    return null;
  }

  const { labels, datasets } = data;
  const { name, backgroundColor, data: fiatAtFinals } = datasets[0];

  return (
    <div className="flex flex-1 flex-col gap-y-2 justify-center text12Medium">
      {labels.map((label, index) => (
        <div
          key={index}
          role="button"
          className="flex justify-between items-center cursor-pointer hover:underline"
          onClick={() => handleProjectClick(label)}
        >
          <div
            className="flex items-center"
            title={`${name[index]} ${formatNum(fiatAtFinals[index])}`}
          >
            <span
              className="w-[12px] h-[12px] rounded-[2px] inline-block mr-2"
              style={{ backgroundColor: backgroundColor[index] }}
            />
            <span className="text-textPrimary">
              {projects?.[index]?.nameAbbr ?? name[index]}
            </span>
            <span className="text-textPrimary ml-1">
              {formatNum(fiatAtFinals[index])}
            </span>
          </div>
        </div>
      ))}
      {ProjectProposalsPopup}
    </div>
  );
}
