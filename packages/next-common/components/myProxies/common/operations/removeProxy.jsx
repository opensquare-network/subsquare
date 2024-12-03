import RemoveButton from "next-common/components/removeButton";
import Tooltip from "next-common/components/tooltip";

export default function RemoveProxy({ data }) {
  function handleRemove() {
    // TODO: remove proxy
    /* eslint-disable-next-line no-console */
    console.log(":::remove", data);
  }

  return (
    <Tooltip content="Remove">
      <RemoveButton onClick={handleRemove} />
    </Tooltip>
  );
}
