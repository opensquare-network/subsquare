import { isNil, sum } from "lodash";
import FieldLoading from "next-common/components/icons/fieldLoading";
import PreimageDetailPopup from "next-common/components/preImages/preImageDetailPopup";
import UnnotePopup from "next-common/components/preImages/unnotePopup";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoBorderList from "next-common/components/styledList/noBorderList";
import useColumns from "next-common/components/styledList/useColumns";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import usePreimage from "next-common/hooks/usePreimage";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { toPrecision } from "next-common/utils";
import preImages from "next-common/utils/consts/menu/preImages";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useState } from "react";
import { useDispatch } from "react-redux";
import DepositTemplate from "./depositTemplate";
import { useSelector } from "react-redux";
import { myPreimageDepositsSelector } from "next-common/store/reducers/myOnChainData/deposits/myPreimageDeposits";
import { Hash, Proposal, Status } from "../preImages/fields";
import { PreimageMobileListItemTemplate } from "../preImages/mobile";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import Loading from "../loading";
import { useNavCollapsed } from "next-common/context/nav";
import MyDepositUndoButton from "./undoButton";

export default function MyDepositPreimages() {
  const [showArgumentsDetail, setShowArgumentsDetail] = useState(null);
  const statuses = useSelector(myPreimageDepositsSelector);
  const activeCount = sum([statuses?.length || 0]);
  const loading = isNil(statuses);
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
            data={statuses}
            setShowArgumentsDetail={setShowArgumentsDetail}
          />
        ) : (
          <DesktopList
            data={statuses}
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

  const rows = data?.map(([hash]) => {
    return {
      useData() {
        const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);

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
              <Status statusName={preimage.statusName} count={preimage.count} />
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
    <ScrollerX>
      <NoBorderList
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
      {data.map(([hash]) => (
        <MobileListItem
          key={hash}
          hash={hash}
          setShowArgumentsDetail={setShowArgumentsDetail}
        />
      ))}
    </div>
  );
}
function MobileListItem({ hash, setShowArgumentsDetail }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);

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
            deposit={preimage.deposit}
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
          preimage.deposit && <BalanceCell deposit={preimage.deposit} />
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
  const { who } = deposit;
  const [showPopup, setShowPopup] = useState(false);

  function onInBlock() {
    dispatch(incPreImagesTrigger());
  }

  const disabled =
    count === 0 &&
    status.toLowerCase() === "unrequested" &&
    realAddress === who;

  return (
    <>
      <Tooltip content={"Unnote"}>
        <MyDepositUndoButton
          disabled={disabled}
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
