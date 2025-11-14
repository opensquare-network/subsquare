import { useState, useCallback } from "react";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ProjectProposalsPopup = dynamicPopup(() =>
  import("../projectDetailPopup"),
);

export default function ProjectIndicators({ data, projects = [] }) {
  const [showProjectProposalsPopup, setShowProjectProposalsPopup] =
    useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = useCallback(
    (label) => {
      const project = projects.find((p) => p.name === label);
      if (!project) {
        return;
      }
      setSelectedProject(project);
      setShowProjectProposalsPopup(true);
    },
    [projects],
  );

  if (!data) {
    return null;
  }

  const { labels, datasets } = data;
  const { name, percentage, backgroundColor, data: fiatAtFinals } = datasets[0];

  return (
    <div className="flex flex-1 flex-col gap-y-[2px] justify-center">
      {labels.map((label, index) => (
        <div
          key={index}
          className="flex justify-between items-center cursor-pointer"
          onClick={() => handleProjectClick(label)}
        >
          <div>
            <span
              className="w-[12px] h-[12px] rounded-[2px] inline-block mr-2"
              style={{ backgroundColor: backgroundColor[index] }}
            />
            <span className="text12Medium text-textPrimary">{name[index]}</span>
            <ValueDisplay
              className="text12Medium text-textPrimary ml-1"
              value={toPrecision(fiatAtFinals[index])}
              symbol=""
              prefix="$"
            />
          </div>
          <span className="text12Medium text-textSecondary">
            {percentage[index]}
          </span>
        </div>
      ))}
      {showProjectProposalsPopup && (
        <ProjectProposalsPopup
          onClose={() => setShowProjectProposalsPopup(false)}
          selectedProject={selectedProject}
        />
      )}
    </div>
  );
}
