import { isNil } from "lodash-es";
import { SystemLoading } from "@osn/icons/subsquare";

export default function DelegatesLoadable({ delegates, children }) {
  if (isNil(delegates)) {
    return (
      <SystemLoading className="my-6 [&_path]:stroke-textTertiary mx-auto" />
    );
  }

  return children;
}
