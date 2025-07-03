import AppendantEditor from "./editor";
import { Label, LabelWrapper } from "next-common/components/post/styled";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { cn } from "next-common/utils";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import Popup from "next-common/components/popup/wrapper/Popup";

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

export default function AppendantPopup({ setIsAppend }) {
  return (
    <Popup
      title="Appendants"
      onClose={() => {
        setIsAppend(false);
      }}
      className="w-[800px]"
    >
      <Wrapper>
        <GreyPanel className="text14Medium text-gray500 py-2.5 px-4 max-w-full !block">
          You are editing appendants (as curator/curator signatory).
        </GreyPanel>
        <LabelWrapper className="!my-4">
          <Label>Content</Label>
        </LabelWrapper>
        <AppendantEditor
          onClose={() => {
            setIsAppend(false);
          }}
        />
      </Wrapper>
    </Popup>
  );
}
