import { Gov2ReferendaTag } from "next-common/components/tags/state/gov2";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import { useMemo } from "react";

export default function StateTag({ referendum }) {
  const stateArgs = useMemo(() => {
    return getGov2ReferendumStateArgs(referendum?.onchainData?.state);
  }, [referendum?.onchainData?.state]);

  if (!referendum) {
    return null;
  }

  return <Gov2ReferendaTag state={referendum.state.name} args={stateArgs} />;
}
