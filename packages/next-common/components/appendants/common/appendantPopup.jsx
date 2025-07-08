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

export default function AppendantPopup({
  setIsAppend,
  isEditMode = false,
  description,
  children,
}) {
  const title = isEditMode ? "Edit Appendant" : "Appendant";

  return (
    <Popup
      title={title}
      onClose={() => {
        setIsAppend(false);
      }}
      className="w-[800px]"
    >
      <Wrapper>
        <GreyPanel className="text14Medium text-gray500 py-2.5 px-4 max-w-full !block">
          {description}
        </GreyPanel>
        <LabelWrapper className="!my-4">
          <Label>Content</Label>
        </LabelWrapper>
        {children}
      </Wrapper>
    </Popup>
  );
}
