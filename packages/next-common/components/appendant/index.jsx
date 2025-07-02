import AppendantEditor from "./editor";
import { Label, LabelWrapper } from "next-common/components/post/styled";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { cn } from "next-common/utils";

function Wrapper({ children }) {
  return (
    <NeutralPanel
      className={cn(
        "text-textPrimary !border-none !shadow-none",
        "[&_textarea:read-only]:bg-neutral200",
        "[&_div.ql-disabled]:bg-neutral200",
        "[&_div+textarea]:border-neutral400",
        "[&_input]:text-textPrimary",
        "max-md:-mx-4 max-md:rounded-none max-md:p-6",
      )}
    >
      {children}
    </NeutralPanel>
  );
}

export default function Appendant() {
  return (
    <Wrapper>
      <LabelWrapper className="!my-4">
        <Label>Appendants</Label>
      </LabelWrapper>
      <AppendantEditor />
    </Wrapper>
  );
}
