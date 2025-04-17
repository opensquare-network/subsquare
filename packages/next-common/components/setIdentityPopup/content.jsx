import ExistentialDeposit from "next-common/components/popup/fields/existentialDepositField";
import Signer from "next-common/components/popup/fields/signerField";
import TextInputField from "next-common/components/popup/fields/textInputField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useContextApi } from "next-common/context/api";
import PrimaryButton from "next-common/lib/button/primary";
import RightWrapper from "next-common/components/rightWraper";

export default function SetIdentityPopupContent() {
  const api = useContextApi();

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
      <AdvanceSettings>
        <ExistentialDeposit destApi={api} title="Deposit" />
      </AdvanceSettings>
      <RightWrapper>
        <PrimaryButton className="w-auto" onClick={() => {}}>
          Set Identity
        </PrimaryButton>
      </RightWrapper>
    </div>
  );
}
