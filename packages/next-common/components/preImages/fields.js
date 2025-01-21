import Copyable from "next-common/components/copyable";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { cn, isSameAddress, toPrecision } from "next-common/utils";
import DetailButton from "next-common/components/detailButton";
import DotSplitter from "next-common/components/dotSplitter";
import UnnoteButton from "./unnoteButton";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import AddressUser from "../user/addressUser";

export function Hash({ hash, proposal, setShowArgumentsDetail }) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <Copyable className="max-md:flex max-md:items-center" copyText={hash}>
          <span className="text14Medium text-textPrimary inline-block w-[96px] truncate">
            {hash}
          </span>
        </Copyable>
      </div>
      <div className="flex items-centers pr-4 max-md:hidden">
        <DetailButton
          disabled={!proposal}
          onClick={() => setShowArgumentsDetail(proposal)}
        />
      </div>
    </div>
  );
}

export function Deposit({
  hash,
  deposit,
  count,
  status,
  onUnnoteInBlock,
  right = false,
}) {
  const { symbol, decimals } = useChainSettings();
  const { who, amount } = deposit;
  const realAddress = useRealAddress();

  const unnote = count === 0 &&
    status.toLowerCase() === "unrequested" &&
    isSameAddress(realAddress, who) && (
      <>
        <DotSplitter />
        <UnnoteButton hash={hash} onInBlock={onUnnoteInBlock} />
      </>
    );

  return (
    <div className="flex flex-col">
      <AddressUser add={who} maxWidth={128} />
      <div
        className={cn(
          "flex ml-[28px] text-textSecondary text-[12px]",
          right ? "justify-end" : "",
        )}
      >
        <ValueDisplay
          className="whitespace-nowrap"
          value={toPrecision(amount.toJSON(), decimals)}
          symbol={symbol}
        />
        {unnote}
      </div>
    </div>
  );
}

export function Proposal({
  proposal,
  proposalError,
  proposalWarning,
  setShowArgumentsDetail,
}) {
  if (proposalError) {
    return <span className="text-red500 font-medium">{proposalError}</span>;
  }
  if (proposalWarning) {
    return (
      <span className="text-orange500 font-medium">{proposalWarning}</span>
    );
  }
  const { section, method, meta } = proposal || {};
  const doc = meta?.docs[0]?.toJSON();
  return (
    <div className="flex flex-col max-md:overflow-hidden">
      <span
        className="text-textPrimary font-medium leading-[20px] hover:underline cursor-pointer max-md:text-[16px] max-md:leading-[24px]"
        onClick={() => setShowArgumentsDetail(proposal)}
      >{`${section}.${method}`}</span>
      <span className="text-textSecondary text-[12px] leading-[16px] max-md:text-[14px] max-md:whitespace-nowrap max-md:overflow-hidden max-md:text-ellipsis max-md:leading-[20px]">
        {doc}
      </span>
    </div>
  );
}

export function Status({ statusName, count }) {
  return (
    <span key="status" className="capitalize text-textTertiary text14Medium">
      {statusName + (count ? `(${count})` : "")}
    </span>
  );
}
