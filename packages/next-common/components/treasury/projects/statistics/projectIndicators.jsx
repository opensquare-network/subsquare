import { useState, useCallback } from "react";
import { formatNum } from "next-common/utils";
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
          <div className="flex items-center">
            <span
              className="w-[12px] h-[12px] rounded-[2px] inline-block mr-2"
              style={{ backgroundColor: backgroundColor[index] }}
            />
            <span className="text-textPrimary">{name[index]}</span>
            <span className="text-textPrimary ml-1">
              {formatNum(fiatAtFinals[index])}
            </span>
          </div>
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
