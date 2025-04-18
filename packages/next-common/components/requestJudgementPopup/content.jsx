import Signer from "next-common/components/popup/fields/signerField";
import RadioOptionGroup, {
  RadioOptionGroupType,
} from "next-common/components/radioOptionGroup";
import PrimaryButton from "next-common/lib/button/primary";
import useRegistrars from "next-common/hooks/people/useRegistrars";
import { useState } from "react";
import LoadableContent from "../common/loadableContent";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

export default function RequestJudgementPopupContent() {
  const [value, setValue] = useState();
  const chainSettings = useChainSettings();
  const { registrars, isLoading } = useRegistrars();

  return (
    <div className="flex flex-col gap-y-4">
      <Signer
        balance={0}
        isBalanceLoading={false}
        symbol={chainSettings.symbol}
        className="[& .label-text]:text14Bold"
      />

      <div className="text14Bold text-textPrimary">Select a Registrar</div>
      <LoadableContent isLoading={isLoading}>
        <RadioOptionGroup
          type={RadioOptionGroupType.REQUEST_JUDGEMENT}
          className="gap-y-3"
          options={(registrars ?? []).map((registrar) => ({
            value: registrar.account,
            judgement: {
              ...registrar,
              fee: toPrecision(registrar.fee, chainSettings.decimals),
            },
          }))}
          selected={value}
          setSelected={setValue}
        />
      </LoadableContent>
      <div className="flex justify-end">
        <PrimaryButton className="w-auto" onClick={() => {}} disabled={!value}>
          Submit
        </PrimaryButton>
      </div>
    </div>
  );
}
