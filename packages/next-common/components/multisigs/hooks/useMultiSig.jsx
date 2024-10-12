import { SystemSignature, SystemClose } from "@osn/icons/subsquare";

export default function useMultiSig() {
  const component = (
    <div>
      <span className="inline-flex p-1.5">
        <SystemSignature className="w-4 h-4" />
      </span>
      {/* TODO: cancel */}
      {/* <span className="inline-flex p-1.5">
        <SystemClose className="w-4 h-4" />
      </span> */}
    </div>
  );

  // TODO: action
  return {
    component,
  };
}
