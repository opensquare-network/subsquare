import ExternalLink from "next-common/components/externalLink";
import { mimir } from "next-common/utils/consts/connect";

export default function CuratorActionHint() {
  return (
    <div className="text14Medium text-textTertiary">
      For multisig curators, we suggest to do actions with{" "}
      <ExternalLink href={mimir.installUrl}>Mimir</ExternalLink>
    </div>
  );
}
