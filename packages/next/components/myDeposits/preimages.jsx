import { SystemClose } from "@osn/icons/subsquare";
import { sum } from "lodash";
import GhostButton from "next-common/components/buttons/ghostButton";
import FieldLoading from "next-common/components/icons/fieldLoading";
import PreimageDetailPopup from "next-common/components/preImages/preImageDetailPopup";
import {
  PreimageHashCell,
  PreimageProposalCell,
  PreimagesStatusCell,
} from "next-common/components/preImages/table";
import UnnotePopup from "next-common/components/preImages/unnotePopup";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoBorderList from "next-common/components/styledList/noBorderList";
import useColumns from "next-common/components/styledList/useColumns";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import usePreimage from "next-common/hooks/usePreimage";
import usePreimageHashs from "next-common/hooks/usePreimageHashs";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { toPrecision } from "next-common/utils";
import preImages from "next-common/utils/consts/menu/preImages";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useState } from "react";
import { useDispatch } from "react-redux";
import DepositTemplate from "./depositTemplate";

export default function MyDepositPreimages() {
  const [showArgumentsDetail, setShowArgumentsDetail] = useState(null);
  const hashes = usePreimageHashs({ myDepositOnly: true });
  const activeCount = sum([hashes?.length || 0]);

  const { columns } = useColumns([
    {
      name: "Hash",
      className: "text-left w-40",
    },
    {
      name: "Arguments",
      className: "text-left min-w-[360px]",
    },
    {
      name: "Balance",
      className: "text-right w-40 min-w-[128px]",
    },
    {
      name: "Length",
      className: "text-right w-20 min-w-[80px]",
    },
    {
      name: "Status",
      className: "text-right w-40 min-w-[128px]",
    },
    {
      name: "", // unnote
      className: "text-right w-20 min-w-[80px]",
    },
  ]);

  const rows = hashes?.map(([hash]) => {
    return {
      useData() {
        const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);

        const row = [
          <PreimageHashCell
            key="hash"
            hash={hash}
            proposal={preimage.proposal}
            setShowArgumentsDetail={setShowArgumentsDetail}
          />,
          isBytesLoaded ? (
            <PreimageProposalCell
              key="proposal"
              proposal={preimage.proposal}
              proposalError={preimage.proposalError}
              proposalWarning={preimage.proposalWarning}
              setShowArgumentsDetail={setShowArgumentsDetail}
            />
          ) : (
            <FieldLoading />
          ),
          isStatusLoaded ? (
            preimage.deposit && <BalanceCell deposit={preimage.deposit} />
          ) : (
            <FieldLoading />
          ),
          isStatusLoaded ? (
            preimage.proposalLength?.toJSON()?.toLocaleString()
          ) : (
            <FieldLoading />
          ),
          isStatusLoaded ? (
            preimage.statusName && (
              <PreimagesStatusCell
                statusName={preimage.statusName}
                count={preimage.count}
              />
            )
          ) : (
            <FieldLoading />
          ),
          isStatusLoaded ? (
            <UnnoteButton
              hash={hash}
              count={preimage.count}
              deposit={preimage.deposit}
              status={preimage.statusName}
            />
          ) : (
            <FieldLoading />
          ),
        ];

        row.key = hash;

        return row;
      },
    };
  });

  return (
    <div>
      <DepositTemplate {...preImages} activeCount={activeCount}>
        <ScrollerX>
          <NoBorderList
            columns={columns}
            rows={rows}
            noDataText="No current preimages"
            loading={!hashes}
          />
        </ScrollerX>
      </DepositTemplate>

      {showArgumentsDetail && (
        <PreimageDetailPopup
          setShow={() => setShowArgumentsDetail(null)}
          proposal={showArgumentsDetail}
        />
      )}
    </div>
  );
}

function BalanceCell({ deposit }) {
  const { symbol, decimals } = useChainSettings();
  const { amount } = deposit ?? {};

  return (
    <ValueDisplay
      className="whitespace-nowrap"
      value={toPrecision(amount.toJSON(), decimals)}
      symbol={symbol}
    />
  );
}

function UnnoteButton({ hash, count, deposit, status }) {
  const realAddress = useRealAddress();
  const dispatch = useDispatch();
  const { who } = deposit;
  const [showPopup, setShowPopup] = useState(false);

  function onInBlock() {
    dispatch(incPreImagesTrigger());
  }

  return (
    <>
      {count === 0 &&
        status.toLowerCase() === "unrequested" &&
        realAddress === who && (
          <Tooltip content={"Unnote"}>
            <GhostButton
              className="!p-1.5 !w-7 !h-7 !rounded"
              onClick={() => setShowPopup(true)}
            >
              <SystemClose className="w-4 h-4 [&_path]:fill-textPrimary" />
            </GhostButton>
          </Tooltip>
        )}
      {showPopup && (
        <UnnotePopup
          hash={hash}
          onClose={() => setShowPopup(false)}
          onInBlock={onInBlock}
        />
      )}
    </>
  );
}
