import { isNil, sum } from "lodash-es";
import FieldLoading from "next-common/components/icons/fieldLoading";
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
import dynamicPopup from "next-common/lib/dynamic/popup";

const PreimageDetailPopup = dynamicPopup(() =>
  import("next-common/components/preImages/preImageDetailPopup"),
);

const UnnotePopup = dynamicPopup(() =>
  import("next-common/components/preImages/unnotePopup"),
);

function createPreimageRow(
  hash,
  preimage,
  isStatusLoaded,
  isBytesLoaded,
  setShowArgumentsDetail,
) {
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
      preimage.proposalLength?.toNumber()?.toLocaleString()
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
}

function PreimageRow({ DataListItem, hash, setShowArgumentsDetail }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);
  const row = createPreimageRow(
    hash,
    preimage,
    isStatusLoaded,
    isBytesLoaded,
    setShowArgumentsDetail,
  );
  return <DataListItem row={row} />;
}

function OldPreimageRow({ DataListItem, hash, setShowArgumentsDetail }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = useOldPreimage(hash);
  const row = createPreimageRow(
    hash,
    preimage,
    isStatusLoaded,
    isBytesLoaded,
    setShowArgumentsDetail,
  );
  return <DataListItem row={row} />;
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

  return (
    <ScrollerX>
      <DataList
        columns={columns}
        rows={data}
        noDataText="No current preimages"
        loading={loading}
        renderItem={(DataListItem, idx, rows) => {
          const { hash, method } = rows[idx];

          if (method === "requestStatusFor") {
            return (
              <PreimageRow
                key={hash}
                DataListItem={DataListItem}
                hash={hash}
                setShowArgumentsDetail={setShowArgumentsDetail}
              />
            );
          }

          return (
            <OldPreimageRow
              key={hash}
              DataListItem={DataListItem}
              hash={hash}
              setShowArgumentsDetail={setShowArgumentsDetail}
            />
          );
        }}
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
      {data.map(({ hash, method }) => {
        if (method === "requestStatusFor") {
          return (
            <MobilePreimageListItem
              key={hash}
              hash={hash}
              setShowArgumentsDetail={setShowArgumentsDetail}
            />
          );
        }

        return (
          <MobileOldPreimageListItem
            key={hash}
            hash={hash}
            setShowArgumentsDetail={setShowArgumentsDetail}
          />
        );
      })}
    </div>
  );
}

function MobilePreimageListItem({ hash, setShowArgumentsDetail }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);
  return (
    <MobileListItem
      hash={hash}
      setShowArgumentsDetail={setShowArgumentsDetail}
      preimage={preimage}
      isStatusLoaded={isStatusLoaded}
      isBytesLoaded={isBytesLoaded}
    />
  );
}

function MobileOldPreimageListItem({ hash, setShowArgumentsDetail }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = useOldPreimage(hash);
  return (
    <MobileListItem
      hash={hash}
      setShowArgumentsDetail={setShowArgumentsDetail}
      preimage={preimage}
      isStatusLoaded={isStatusLoaded}
      isBytesLoaded={isBytesLoaded}
    />
  );
}

function MobileListItem({
  hash,
  setShowArgumentsDetail,
  preimage,
  isStatusLoaded,
  isBytesLoaded,
}) {
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
            {preimage.proposalLength?.toNumber()?.toLocaleString()}
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
    status?.toLowerCase?.() === "unrequested" &&
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
