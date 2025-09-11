import useCallFromHex, {
  useCallFromHexIndexer,
} from "next-common/utils/hooks/useCallFromHex";
import CallTree from "next-common/components/proposal/callTree";
import { useEffect } from "react";
import { noop } from "lodash-es";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";

export default function ProposeTree({ callHex, when, setValue = noop }) {
  const indexer = useCallFromHexIndexer(when?.height);

  return (
    <MigrationConditionalApiProvider indexer={indexer}>
      <ProposeTreeWithContext callHex={callHex} setValue={setValue} />
    </MigrationConditionalApiProvider>
  );
}

function ProposeTreeWithContext({ callHex, setValue = noop }) {
  const { call, isLoading } = useCallFromHex(callHex);

  useEffect(() => {
    if (!setValue) {
      return;
    }

    setValue({ isValid: !isLoading, data: call });
  }, [call, isLoading, setValue]);

  return <CallTree call={call} isLoading={isLoading} />;
}
