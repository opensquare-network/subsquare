import { useCallback, useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import TextInputField from "../popup/fields/textInputField";
import nextApi from "next-common/services/nextApi";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import ThresholdField from "./fields/threshold";
import SignatoriesField from "./fields/signatories";
import { useSignatories } from "./context/signatories";

export default function CreateMultisigContent() {
  const address = useRealAddress();
  const { ensureLogin } = useEnsureLogin();
  const [threshold, setThreshold] = useState();
  const [name, setName] = useState("");
  const { signatories } = useSignatories();

  const handleSubmit = useCallback(
    async (e) => {
      await ensureLogin();
      e.preventDefault();
      await nextApi.post("user/multisigs", {
        signatories: [address, ...signatories],
        threshold,
        name,
      });
    },
    [ensureLogin, address, signatories, threshold, name],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <SignatoriesField />

      <ThresholdField
        signatories={signatories}
        onChange={setThreshold}
        value={threshold}
      />
      <TextInputField
        title="Name"
        text={name}
        setText={setName}
        placeholder="Please fill the name..."
      />
      <div className="flex justify-end">
        <PrimaryButton type="submit">Submit</PrimaryButton>
      </div>
    </form>
  );
}
