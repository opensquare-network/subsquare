import { SystemSignature, SystemClose } from "@osn/icons/subsquare";

function SignatureIcon() {
  return (
    <span className="inline-flex p-1.5 border border-neutral400 rounded-[4px] hover:cursor-pointer">
      <SystemSignature className="w-4 h-4 [&_path]:fill-textPrimaryContrast" />
    </span>
  );
}

function CancelIcon() {
  return (
    <span className="inline-flex p-1.5 border border-neutral400 rounded-[4px] hover:cursor-pointer mr-3">
      <SystemClose className="w-4 h-4 [&_path]:fill-textPrimary" />
    </span>
  );
}

export default function useMultiSig() {
  const component = (
    <div>
      {/* <CancelIcon /> */}
      <SignatureIcon />
      {/* TODO: cancel */}
    </div>
  );

  // TODO: action
  return {
    component,
  };
}
