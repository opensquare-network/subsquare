import { useState, useCallback } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ProjectProposalsPopup = dynamicPopup(() =>
  import("../projectDetailPopup"),
);

export default function useProjectChartInteraction(projects = []) {
  const [showProjectProposalsPopup, setShowProjectProposalsPopup] =
    useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = useCallback(
    (projectName) => {
      const project = projects.find((p) => p.name === projectName);
      if (!project) {
        return;
      }
      setSelectedProject(project);
      setShowProjectProposalsPopup(true);
    },
    [projects],
  );

  const handleBarClick = useCallback(
    ({ label }) => handleProjectClick(label),
    [handleProjectClick],
  );

  const handleClosePopup = useCallback(() => {
    setShowProjectProposalsPopup(false);
    setSelectedProject(null);
  }, []);

  return {
    showProjectProposalsPopup,
    selectedProject,
    handleProjectClick,
    handleBarClick,
    handleClosePopup,
    ProjectProposalsPopup: showProjectProposalsPopup ? (
      <ProjectProposalsPopup
        onClose={handleClosePopup}
        selectedProject={selectedProject}
      />
    ) : null,
  };
}
