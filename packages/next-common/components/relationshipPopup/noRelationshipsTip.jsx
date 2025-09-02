import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { VIEW_TYPE } from "next-common/context/relationship/selectViewType";
import { cn } from "next-common/utils";

export default function NoRelationshipsTip({
  type = VIEW_TYPE.COMMON,
  className = "",
}) {
  let text = "";
  if (type === VIEW_TYPE.COMMON) {
    text =
      "This account has no relationships with proxy, multisig and identity.";
  } else if (type === VIEW_TYPE.DELEGATION) {
    text = "This account has no relationships with delegators and delegated.";
  }
  return (
    <GreyPanel
      className={cn(
        "justify-start gap-x-2 text14Medium text-textSecondary py-2.5 px-4 max-w-full",
        className,
      )}
    >
      {text}
    </GreyPanel>
  );
}
