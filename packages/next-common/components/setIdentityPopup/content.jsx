import Signer from "next-common/components/popup/fields/signerField";
import TextInputField from "next-common/components/popup/fields/textInputField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import useSetIdentityDeposit from "next-common/hooks/people/useSetIdentityDeposit";
import PrimaryButton from "next-common/lib/button/primary";
import RightWrapper from "next-common/components/rightWraper";
import { useState, useCallback, useEffect } from "react";
import { toPrecision } from "next-common/utils";
import PopupLabel from "next-common/components/popup/label";
import CurrencyInput from "next-common/components/currencyInput";
import LoadableContent from "next-common/components/common/loadableContent";
import { useChainSettings } from "next-common/context/chain";
import useSubMyIdentityInfo from "next-common/hooks/people/useSubMyIdentityInfo";
const fields = [
  {
    title: "Display Name",
    key: "display",
  },
  {
    title: "Legal Name",
    key: "legal",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Web",
    key: "web",
  },
  {
    title: "Twitter",
    key: "twitter",
  },
  {
    title: "Discord",
    key: "discord",
  },
  {
    title: "Github",
    key: "github",
  },
];

export default function SetIdentityPopupContent() {
  const chainSettings = useChainSettings();
  const [identityInfo, setIdentityInfo] = useState({});
  const { result: subMyIdentityInfo } = useSubMyIdentityInfo();

  useEffect(() => {
    if (subMyIdentityInfo) {
      setIdentityInfo(subMyIdentityInfo);
    }
  }, [subMyIdentityInfo]);

  const updateIdentityInfo = useCallback((key, value) => {
    setIdentityInfo((prev) => ({ ...prev, [key]: value }));
  }, []);

  const { deposit, isLoading } = useSetIdentityDeposit(identityInfo);

  return (
    <div className="space-y-4">
      <Signer balance={0} isBalanceLoading={false} symbol="DOT" />
      {fields.map((field) => (
        <TextInputField
          key={field.key}
          title={field.title}
          text={identityInfo[field.key]}
          setText={(value) => updateIdentityInfo(field.key, value)}
        />
      ))}
      <AdvanceSettings>
        <div>
          <PopupLabel text="Deposit" />
          <CurrencyInput
            disabled
            value={
              isLoading ? "" : toPrecision(deposit || 0, chainSettings.decimals)
            }
            prefix={<LoadableContent isLoading={isLoading} />}
            symbol="DOT"
          />
        </div>
      </AdvanceSettings>
      <RightWrapper>
        <PrimaryButton className="w-auto" onClick={() => {}}>
          Set Identity
        </PrimaryButton>
      </RightWrapper>
    </div>
  );
}
