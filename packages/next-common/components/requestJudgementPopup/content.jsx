import Signer from "next-common/components/popup/fields/signerField";
import RadioOptionGroup, {
  RadioOptionGroupType,
} from "next-common/components/radioOptionGroup";
import useRegistrars from "next-common/hooks/people/useRegistrars";
import { useState, useCallback } from "react";
import LoadableContent from "../common/loadableContent";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { isEmpty } from "lodash-es";

export default function RequestJudgementPopupContent() {
  const [value, setValue] = useState();
  const chainSettings = useChainSettings();
  const { registrars, isLoading } = useRegistrars();
  const api = useContextApi();
  const dispatch = useDispatch();

  const getTxFunc = useCallback(() => {
    if (!api || !api?.tx?.identity || isEmpty(registrars) || !value) {
      return;
    }

    const selectedRegistrar = registrars.find(
      (registrar) => registrar.account === value,
    );
    const { index, fee } = selectedRegistrar;

    return api.tx.identity?.requestJudgement(index, fee);
  }, [api, registrars, value]);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Request judgement successfully"));
  }, [dispatch]);

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
      <TxSubmissionButton getTxFunc={getTxFunc} onInBlock={onInBlock} />
    </div>
  );
}
