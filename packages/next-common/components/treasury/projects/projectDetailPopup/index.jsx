import { isNil, noop } from "lodash-es";
import Popup from "next-common/components/popup/wrapper/Popup";
import ProjectContent from "./content";

export default function ProjectProposalsPopup({
  onClose = noop,
  selectedProject,
}) {
  if (isNil(selectedProject)) {
    return null;
  }

  return (
    <Popup title={`${selectedProject.name} Proposals`} onClose={onClose}>
      <ProjectContent project={selectedProject} />
    </Popup>
  );
}
