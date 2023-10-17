import RemoveButton from "next-common/components/removeButton";
import noop from "lodash.noop";

export default function RemoveDelegation({ trackId }) {
  console.log("trackId", trackId);
  return (
    <>
      <RemoveButton onClick={noop} />
    </>
  );
}
