import { isNil, sum } from "lodash";
import FieldLoading from "next-common/components/icons/fieldLoading";
import PreimageDetailPopup from "next-common/components/preImages/preImageDetailPopup";
import UnnotePopup from "next-common/components/preImages/unnotePopup";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import useColumns from "next-common/components/styledList/useColumns";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import usePreimage from "next-common/hooks/usePreimage";
import useOldPreimage from "next-common/hooks/useOldPreimage";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { isSameAddress, toPrecision } from "next-common/utils";
import preImages from "next-common/utils/consts/menu/preImages";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useState } from "react";
import { useDispatch } from "react-redux";
import DepositTemplate from "./depositTemplate";
import { Hash, Proposal, Status } from "../preImages/fields";
import { PreimageMobileListItemTemplate } from "../preImages/mobile";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import Loading from "../loading";
import { useNavCollapsed } from "next-common/context/nav";
import MyDepositUndoButton from "./undoButton";
import DataList from "../dataList";

function createUsePreimageHook(hash, setShowArgumentsDetail, usePreimage) {
  return () => {
    const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);
    const deposit = preimage?.ticket || preimage?.deposit;

    const row = [
      <Hash
        key="hash"
        hash={hash}
        proposal={preimage.proposal}
        setShowArgumentsDetail={setShowArgumentsDetail}
      />,
      isBytesLoaded ? (
        <Proposal
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
        deposit && <BalanceCell deposit={deposit} />
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
          <Status statusName={preimage.statusName} count={preimage.count} />
        )
      ) : (
        <FieldLoading />
      ),
      isStatusLoaded ? (
        <UnnoteButton
          hash={hash}
          count={preimage.count}
          deposit={deposit}
          status={preimage.statusName}
        />
      ) : (
        <FieldLoading />
      ),
    ];

    row.key = hash;

    return row;
  };
}

export default function MyDepositPreimages({ deposits }) {
  const [showArgumentsDetail, setShowArgumentsDetail] = useState(null);
  const activeCount = sum([deposits?.length || 0]);
  const loading = isNil(deposits);
  const { sm, md } = useScreenSize();
  const [navCollapsed] = useNavCollapsed();
  const triggerSize = navCollapsed ? sm : md;

  return (
    <div>
      <DepositTemplate
        {...preImages}
        activeCount={activeCount}
        loading={loading}
      >
        {triggerSize ? (
          <MobileList
            data={deposits}
            setShowArgumentsDetail={setShowArgumentsDetail}
          />
        ) : (
          <DesktopList
            data={deposits}
            setShowArgumentsDetail={setShowArgumentsDetail}
          />
        )}
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

function DesktopList({ data, setShowArgumentsDetail }) {
  const loading = isNil(data);

  const { columns } = useColumns([
    {
      name: "Hash",
      // 160 + 16(gap) + 28(button)
      className: "text-left w-[204px]",
    },
    {
      name: "Arguments",
      className: "text-left min-w-[360px]",
    },
    {
      name: "Balance",
      className: "text-right w-40 min-w-[160px]",
    },
    {
      name: "Length",
      className: "text-right w-20 min-w-[80px]",
    },
    {
      name: "Status",
      className: "text-right w-40 min-w-[160px]",
    },
    {
      name: "", // unnote
      className: "text-right w-20 min-w-[80px]",
    },
  ]);

  const rows = data?.map(({ hash, method }) => {
    return {
      useData: createUsePreimageHook(
        hash,
        setShowArgumentsDetail,
        method === "requestStatusFor" ? usePreimage : useOldPreimage,
      ),
    };
  });

  return (
    <ScrollerX>
      <DataList
        columns={columns}
        rows={rows}
        noDataText="No current preimages"
        loading={loading}
      />
    </ScrollerX>
  );
}

function MobileList({ data, setShowArgumentsDetail }) {
  const loading = isNil(data);

  if (loading) {
    return (
      <div className="my-4 flex justify-center items-center">
        <Loading size={24} />
      </div>
    );
  }

  return (
    <div>
      {data.map(({ hash, method }) => (
        <MobileListItem
          key={hash}
          hash={hash}
          setShowArgumentsDetail={setShowArgumentsDetail}
          usePreimage={
            method === "requestStatusFor" ? usePreimage : useOldPreimage
          }
        />
      ))}
    </div>
  );
}
function MobileListItem({ hash, setShowArgumentsDetail, usePreimage }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);
  const deposit = preimage?.ticket || preimage?.deposit;

  return (
    <PreimageMobileListItemTemplate
      title={
        isBytesLoaded ? (
          <Proposal
            key="proposal"
            proposal={preimage.proposal}
            proposalError={preimage.proposalError}
            proposalWarning={preimage.proposalWarning}
            setShowArgumentsDetail={setShowArgumentsDetail}
          />
        ) : (
          <FieldLoading />
        )
      }
      titleExtra={
        isStatusLoaded && (
          <UnnoteButton
            hash={hash}
            count={preimage.count}
            deposit={deposit}
            status={preimage.statusName}
          />
        )
      }
      status={
        isStatusLoaded ? (
          preimage.statusName && (
            <Status
              key="status"
              statusName={preimage.statusName}
              count={preimage.count}
            />
          )
        ) : (
          <FieldLoading />
        )
      }
      hash={
        <Hash
          key="hash"
          hash={hash}
          proposal={preimage.proposal}
          setShowArgumentsDetail={setShowArgumentsDetail}
        />
      }
      depositBalance={
        isStatusLoaded ? (
          deposit && <BalanceCell deposit={deposit} />
        ) : (
          <FieldLoading />
        )
      }
      length={
        isStatusLoaded ? (
          <span className="text-textPrimary">
            {preimage.proposalLength?.toJSON()?.toLocaleString()}
          </span>
        ) : (
          <FieldLoading />
        )
      }
    />
  );
}

function BalanceCell({ deposit }) {
  const { symbol, decimals } = useChainSettings();
  const { amount } = deposit ?? {};

  return (
    <ValueDisplay
      className="whitespace-nowrap text-textPrimary"
      value={toPrecision(amount.toJSON(), decimals)}
      symbol={symbol}
    />
  );
}

function UnnoteButton({ hash, count, deposit, status }) {
  const realAddress = useRealAddress();
  const dispatch = useDispatch();
  const { who } = deposit || {};
  const [showPopup, setShowPopup] = useState(false);

  function onInBlock() {
    dispatch(incPreImagesTrigger());
  }

  const enabled =
    count === 0 &&
    status.toLowerCase() === "unrequested" &&
    isSameAddress(realAddress, who);

  return (
    <>
      <Tooltip content={"Unnote"}>
        <MyDepositUndoButton
          disabled={!enabled}
          onClick={() => setShowPopup(true)}
        />
      </Tooltip>
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
