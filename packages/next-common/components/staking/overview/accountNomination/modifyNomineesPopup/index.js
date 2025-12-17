import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useContextApi } from "next-common/context/api";
import Signer from "next-common/components/popup/fields/signerField";
import { useCallback, useEffect, useState } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import ErrorMessage from "next-common/components/styled/errorMessage";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { useMyStakingLedger } from "next-common/context/staking/myStakingLedger";
import PopupLabel from "next-common/components/popup/label";
import { cn } from "next-common/utils";
import IconButton from "next-common/components/iconButton";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useValidatorsWithStatus } from "next-common/hooks/staking/useValidatorWithStatus";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import ValidatorsList from "../nomineeListPopup/validatorsList";

const ValidatorSelectPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountNomination/validatorSelectPopup"
  ),
);

function ModifyNomineesPopupContent() {
  const api = useContextApi();
  const realAddress = useRealAddress();
  const [nominees, setNominees] = useState([]);
  const [showValidatorSelectPopup, setShowValidatorSelectPopup] =
    useState(false);

  const { nominators, loading } = useMyStakingLedger();
  useEffect(() => {
    setNominees(nominators?.targets || []);
  }, [nominators]);

  const { active, loading: isNomineesStatusLoading } = useValidatorsWithStatus(
    realAddress,
    nominees || [],
  );

  const atLeastOneNominee = nominees?.length < 1;
  const hasNominees = nominees && nominees.length > 0;
  const nomineesChanged =
    !loading &&
    (nominators?.targets.length !== nominees.length ||
      nominators?.targets.some((n) => !nominees.includes(n)));

  const notEnoughNominees = hasNominees && atLeastOneNominee;
  const canSubmit = hasNominees && nomineesChanged && !atLeastOneNominee;

  let errorMessage = "";
  if (notEnoughNominees) {
    errorMessage = "Please select at least one nominee.";
  }

  const getTxFunc = useCallback(() => {
    if (!api) {
      return;
    }

    if (nominees.length < 1) {
      throw new Error("Please select at least one nominee.");
    }

    return api.tx.staking.nominate(nominees);
  }, [api, nominees]);

  return (
    <div className="space-y-4">
      <Signer title="Origin" noSwitchSigner showTransferable />
      <div>
        <PopupLabel text="Nominees" />
        <div
          className={cn(
            "flex px-[16px] py-[12px] rounded-[8px]",
            "justify-between",
            "border border-neutral200 bg-neutral200",
          )}
        >
          {hasNominees ? (
            <ValidatorsList
              titleClassName="bg-neutral200"
              contentClassName="max-h-[480px] overflow-y-auto bg-neutral200"
              nominees={nominees}
              activeNominees={active || []}
              isLoading={isNomineesStatusLoading}
            />
          ) : (
            <div className="text-textTertiary text14Medium">
              Please add validators
            </div>
          )}
        </div>
        <div className="flex mt-2 justify-end">
          <IconButton onClick={() => setShowValidatorSelectPopup(true)}>
            Modify Nominees
          </IconButton>
        </div>
        {showValidatorSelectPopup && (
          <ValidatorSelectPopup
            onClose={() => setShowValidatorSelectPopup(false)}
            nominees={nominees}
            setNominees={setNominees}
          />
        )}
      </div>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton disabled={!canSubmit} getTxFunc={getTxFunc} />
      </div>
    </div>
  );
}

export default function ModifyNomineesPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Modify Nominees" onClose={onClose}>
        <ModifyNomineesPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
