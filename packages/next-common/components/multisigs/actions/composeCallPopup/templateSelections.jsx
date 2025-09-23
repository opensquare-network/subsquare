import { QuickStart, ComposeCallSelection } from "./quickStart";

export default function TemplateSelections() {
  return (
    <>
      <h6 className="text-textPrimary text14Bold">Quick Start</h6>
      <QuickStart />
      <h6 className="text-textPrimary text14Bold">Compose Call</h6>
      <ComposeCallSelection />
    </>
  );
}
