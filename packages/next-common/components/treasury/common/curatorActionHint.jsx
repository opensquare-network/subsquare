import ExternalLink from "next-common/components/externalLink";
import { cn } from "next-common/utils";
import { mimir } from "next-common/utils/consts/connect";

export default function BountyCuratorActionHint({ className = "" }) {
  return (
    <div className={cn("text14Medium text-textTertiary", className)}>
      For multisig curators, we suggest to do actions with{" "}
      <ExternalLink href={mimir.installUrl}>Mimir</ExternalLink>
    </div>
  );
}
