import { Gov2ReferendaTag } from "next-common/components/tags/state/gov2";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import { useMemo } from "react";

export default function StateTag({ state }) {
  const stateArgs = useMemo(() => {
    return getGov2ReferendumStateArgs(state);
  }, [state]);

  if (!state) {
    return null;
  }

  return <Gov2ReferendaTag state={state.name} args={stateArgs} />;
}
