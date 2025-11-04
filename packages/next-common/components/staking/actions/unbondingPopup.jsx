import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import Popup from "next-common/components/popup/wrapper/Popup";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { useMemo } from "react";
import BigNumber from "bignumber.js";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import DataList from "next-common/components/dataList";
import SecondaryButton from "next-common/lib/button/secondary";
import { useContextApi } from "next-common/context/api";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Divider from "next-common/components/styled/layout/divider";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { ActionIconButton } from "next-common/components/multisigs/styled";
import { SystemTransfer } from "@osn/icons/subsquare";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { isNumber } from "lodash-es";
import Signer from "next-common/components/popup/fields/signerField";

function UnbondingPopupContent() {
  const { unbondingEras = {}, activeEra } = usePopupParams();
  const { decimals, symbol } = useChainSettings();

  const statistics = useMemo(() => {
    let total = BigNumber(0);
    let active = BigNumber(0);
    let inactive = BigNumber(0);
    Object.entries(unbondingEras)?.forEach(([era, amount]) => {
      total = total.plus(amount);
      if (era >= activeEra) {
        inactive = inactive.plus(amount);
      } else {
        active = active.plus(amount);
      }
    });
    return {
      total,
      active,
      inactive,
    };
  }, [unbondingEras, activeEra]);

  return (
    <div className="space-y-4">
      <Signer />
      <SummaryLayout>
        <SummaryItem title="Total">
          <ValueDisplay
            value={toPrecision(statistics.total, decimals)}
            symbol={symbol}
          />
        </SummaryItem>
        <SummaryItem title="Active">
          <ValueDisplay
            value={toPrecision(statistics.active, decimals)}
            symbol={symbol}
          />
        </SummaryItem>
        <SummaryItem title="Inactive">
          <ValueDisplay
            value={toPrecision(statistics.inactive, decimals)}
            symbol={symbol}
          />
        </SummaryItem>
        <SummaryItem title="Active Era">#{activeEra}</SummaryItem>
      </SummaryLayout>
      <Divider />
      <UnbondingList activeEra={activeEra} />
    </div>
  );
}

export default function UnbondingPopup({ onClose, unbondingEras }) {
  const { result } = useSubStorage("staking", "activeEra");
  const activeEra = result?.value?.index?.toNumber();

  if (!isNumber(activeEra)) {
    return null;
  }
  return (
    <SignerPopupWrapper
      onClose={onClose}
      unbondingEras={unbondingEras}
      activeEra={activeEra}
    >
      <Popup title="Unbonding Pool" onClose={onClose}>
        <UnbondingPopupContent />
        <div className="flex justify-end">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        </div>
      </Popup>
    </SignerPopupWrapper>
  );
}

function WithdrawButton({ era }) {
  const { activeEra } = usePopupParams();
  if (era >= activeEra) {
    return null;
  }
  return <WithdrawButtonImpl era={era} />;
}

function WithdrawButtonImpl({ era }) {
  const api = useContextApi();
  const realAddress = useRealAddress();

  const { getTxFuncForSubmit } = useTxBuilder(() => {
    if (!api || !api.tx.nominationPools) {
      return;
    }

    return api.tx.nominationPools.withdrawUnbonded(realAddress, era);
  }, [api, era, realAddress]);
  const { doSubmit, isSubmitting, isWrapping } = useTxSubmission({
    getTxFunc: getTxFuncForSubmit,
  });
  return (
    <div className="flex justify-end">
      <ActionIconButton
        onClick={doSubmit}
        disabled={isSubmitting || isWrapping}
        loading={isSubmitting || isWrapping}
      >
        <SystemTransfer className="w-4 h-4" />
      </ActionIconButton>
    </div>
  );
}

function UnbondingList() {
  const { decimals, symbol } = useChainSettings();
  const { unbondingEras } = usePopupParams();

  const list = useMemo(() => {
    return Object.entries(unbondingEras);
  }, [unbondingEras]);

  const columns = [
    {
      name: "Era",
      style: {
        textAlign: "left",
      },
    },
    {
      name: "Amount",
      style: {
        textAlign: "right",
      },
    },
    {
      name: "",
      width: 60,
      style: {
        textAlign: "right",
      },
    },
  ];

  const rows = list.map(([era, amount]) => [
    <div key={era}>#{era}</div>,
    <ValueDisplay
      key={era}
      value={toPrecision(amount, decimals)}
      symbol={symbol}
    />,
    <WithdrawButton key={era} era={era} />,
  ]);

  return (
    <>
      <TitleContainer className="!p-0 flex justify-start gap-x-1">
        <span className="text-textPrimary text14Bold">List</span>
        <span className="text-textTertiary text12Medium">{list.length}</span>
      </TitleContainer>
      <DataList columns={columns} rows={rows} noDataText="No unbonding eras" />
    </>
  );
}
