import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import Popup from "next-common/components/popup/wrapper/Popup";
import ValidatorsList from "./validatorsList";
import { AddressUser } from "next-common/components/user";
import { SystemSubtract } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import { usePopupOnClose } from "next-common/context/popup";
import {
  useValidators,
  ValidatorsProvider,
} from "next-common/context/staking/validators";
import { useMemo } from "react";
import Loading from "next-common/components/loading";
import Tooltip from "next-common/components/tooltip";

function ValidatorItem({ account, commission, onRemove }) {
  const commissionText = (commission / 10000000).toFixed(2) + "%";
  return (
    <div className="flex gap-2 items-center text-textPrimary text14Medium rounded-full px-2 py-1 border border-neutral300 bg-neutral100">
      <AddressUser className="text14Medium" add={account} />
      <Tooltip content={`Commission: ${commissionText}`}>
        <span className="text-textTertiary">{commissionText}</span>
      </Tooltip>
      {onRemove && (
        <div
          role="button"
          className="cursor-pointer p-1 [&_svg_path]:stroke-textTertiary [&_svg_path]:hover:stroke-theme500"
          onClick={onRemove}
        >
          <SystemSubtract width={16} height={16} />
        </div>
      )}
    </div>
  );
}

export function ValidatorItems({ nominees, setNominees }) {
  const { validators, loading: isLoadingValidators } = useValidators();
  const filteredValidators = useMemo(() => {
    if (isLoadingValidators) {
      return [];
    }
    return validators.filter((v) => nominees.includes(v.account));
  }, [validators, isLoadingValidators, nominees]);

  return (
    <>
      {isLoadingValidators ? (
        <div className="flex justify-center my-2">
          <Loading size={16} />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 w-full">
          {filteredValidators.map((item) => (
            <ValidatorItem
              key={item.account}
              {...item}
              onRemove={
                setNominees &&
                (() =>
                  setNominees((prev) => prev.filter((n) => n !== item.account)))
              }
            />
          ))}
        </div>
      )}
    </>
  );
}

function SelectedValidators({ nominees, setNominees }) {
  if (!nominees || nominees.length === 0) {
    return (
      <div className="text-textTertiary text14Medium">
        No validators selected, add from the list below.
      </div>
    );
  }

  return (
    <>
      <div className="text-textPrimary">
        Your nominations: {nominees?.length || 0}
        <span className="text-textTertiary"> / 16</span>
      </div>
      <ValidatorItems nominees={nominees} setNominees={setNominees} />
    </>
  );
}

function ValidatorSelectPopupContent({ nominees, setNominees }) {
  const onClose = usePopupOnClose();
  return (
    <div className="flex flex-col gap-4 text14Medium">
      <SelectedValidators nominees={nominees} setNominees={setNominees} />
      <ValidatorsList nominees={nominees} setNominees={setNominees} />
      <div className="flex justify-end">
        <PrimaryButton onClick={onClose}>Confirm</PrimaryButton>
      </div>
    </div>
  );
}

export default function ValidatorSelectPopup({
  onClose,
  nominees,
  setNominees,
}) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Nomination List" onClose={onClose}>
        <ValidatorsProvider>
          <ValidatorSelectPopupContent
            nominees={nominees}
            setNominees={setNominees}
          />
        </ValidatorsProvider>
      </Popup>
    </SignerPopupWrapper>
  );
}
