import Signer from "next-common/components/popup/fields/signerField";
import TextInputField from "next-common/components/popup/fields/textInputField";
import PrimaryButton from "next-common/lib/button/primary";
export default function SetIdentityPopupContent() {
  return (
    <div className="space-y-4">
      <Signer balance={0} isBalanceLoading={false} symbol="KSM" />
      <TextInputField title="Display Name" text="" setText={() => {}} />
      <TextInputField title="Legal Name" text="" setText={() => {}} />
      <TextInputField title="Email" text="" setText={() => {}} />
      <TextInputField title="Web" text="" setText={() => {}} />
      <TextInputField title="Twitter" text="" setText={() => {}} />
      <TextInputField title="Discord" text="" setText={() => {}} />
      <TextInputField title="Github Name" text="" setText={() => {}} />
      <TextInputField title="Deposit" text="" setText={() => {}} />
      <PrimaryButton className="w-auto" onClick={() => {}}>
        Set Identity
      </PrimaryButton>
    </div>
  );
}
