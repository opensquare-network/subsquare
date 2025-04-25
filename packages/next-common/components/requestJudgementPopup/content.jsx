import RadioOptionGroup, {
  RadioOptionGroupType,
} from "next-common/components/radioOptionGroup";
import { useState, useCallback } from "react";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { isEmpty } from "lodash-es";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Loading from "../loading";
import styled from "styled-components";
import { useRegistrarContext } from "next-common/context/people/registrarContext";
import useJudgementsData from "next-common/components/people/overview/hooks/useJudgementsData";

const StyledSignerWithBalance = styled.div`
  > div {
    > div:first-child > div {
      font-size: 14px !important;
      &:first-child {
        font-weight: bold !important;
      }
    }
  }
`;

export default function RequestJudgementPopupContent() {
  const [value, setValue] = useState();
  const { symbol, decimals } = useChainSettings();
  const { registrars, isLoading } = useRegistrarContext();
  const api = useContextApi();
  const dispatch = useDispatch();
  const { data = [] } = useJudgementsData();

  const isSelected = (address) =>
    data?.some((registrar) => registrar?.account === address);

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
      <StyledSignerWithBalance>
        <SignerWithBalance />
      </StyledSignerWithBalance>
      <div className="text14Bold text-textPrimary">Select a Registrar</div>

      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loading size="24" />
        </div>
      ) : (
        <RadioOptionGroup
          type={RadioOptionGroupType.REQUEST_JUDGEMENT}
          className="gap-y-3"
          options={(registrars ?? []).map((registrar) => ({
            value: registrar.account,
            judgement: {
              ...registrar,
              fee: toPrecision(registrar.fee, decimals),
              symbol,
            },
            disabled: isSelected(registrar.account),
          }))}
          selected={value}
          setSelected={setValue}
        />
      )}
      <TxSubmissionButton
        disabled={!value}
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
      />
    </div>
  );
}
