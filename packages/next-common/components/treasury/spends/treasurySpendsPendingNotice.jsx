import { SystemClose } from "@osn/icons/subsquare";
import { colorStyle, PromptTypes } from "../../scrollPrompt";
import { GreyPanel } from "../../styled/containers/greyPanel";
import { CACHE_KEY } from "next-common/utils/constants";
import usePromptVisibility from "next-common/hooks/usePromptVisibility";
import { usePendingSpendsFromContext } from "next-common/components/treasury/spends/pendingContext";
import Tooltip from "next-common/components/tooltip";
import nextApi from "next-common/services/nextApi";
import Link from "next-common/components/link";
import { treasurySpendBaseUrl } from "next-common/utils/postBaseUrl";
import { useMemo } from "react";
import { useAsync } from "react-use";

function useSpendTitles(idsKey) {
  const { value: spends } = useAsync(async () => {
    if (!idsKey) {
      return [];
    }

    const ids = idsKey.split(",");
    const { result } = await nextApi.fetch("treasury/spends", {
      valid_only: true,
      ids: idsKey,
      pageSize: ids.length,
      simple: true,
    });
    return result?.items ?? [];
  }, [idsKey]);

  return useMemo(() => {
    const titles = {};
    (spends || []).forEach((item) => {
      titles[item.index] = item.title;
    });
    return titles;
  }, [spends]);
}

function SpendCount({ ids = [], titles }) {
  const count = ids.length;
  if (!count) {
    return <span className="font-bold">0</span>;
  }

  const sortedIds = [...ids].sort((a, b) => a - b);

  return (
    <Tooltip
      contentClassName="max-w-[360px]"
      content={
        <div className="flex flex-col gap-y-0.5">
          {sortedIds.map((id) => (
            <Link
              key={id}
              href={`${treasurySpendBaseUrl}/${id}`}
              className="text-inherit"
            >
              <span className="font-bold">#{id}</span>
              <span className="mx-1">·</span>
              <span className="hover:underline">
                {titles?.[id] || `Treasury spend ${id}`}
              </span>
            </Link>
          ))}
        </div>
      }
    >
      <span className="font-bold">{count}</span>
    </Tooltip>
  );
}

function PendingNoticeContent({
  expiringSoon = [],
  validSoon = [],
  claimable = [],
  titles,
  onClose,
  styleType = PromptTypes.INFO,
}) {
  return (
    <GreyPanel
      className="text14Medium py-2.5 px-4 justify-between"
      style={colorStyle[styleType]}
    >
      <div className="flex flex-wrap items-center gap-x-2">
        <span>Treasury Spends:</span>
        <SpendCount ids={expiringSoon} titles={titles} />
        <span>will expire within 7 days</span>
        <span>·</span>
        <SpendCount ids={validSoon} titles={titles} />
        <span>will become valid within 3 days</span>
        <span>·</span>
        <SpendCount ids={claimable} titles={titles} />
        <span>are claimable</span>
      </div>
      <SystemClose
        className="w-5 h-5 flex-shrink-0 ml-2"
        role="button"
        onClick={onClose}
      />
    </GreyPanel>
  );
}

function DisplayPendingNotice({ styleType, onClose }) {
  const {
    expiringSoonCount,
    validSoonCount,
    claimableCount,
    expiringSoon = [],
    validSoon = [],
    claimable = [],
  } = usePendingSpendsFromContext();

  const idsKey = [
    ...new Set([...expiringSoon, ...validSoon, ...claimable]),
  ].join(",");
  const titles = useSpendTitles(idsKey);

  if (expiringSoonCount === 0 && validSoonCount === 0 && claimableCount === 0) {
    return null;
  }

  return (
    <PendingNoticeContent
      expiringSoon={expiringSoon}
      validSoon={validSoon}
      claimable={claimable}
      titles={titles}
      styleType={styleType}
      onClose={onClose}
    />
  );
}

export default function TreasurySpendsPendingNotice({ styleType }) {
  const { visible, handleClose } = usePromptVisibility(
    CACHE_KEY.treasurySpendsPendingNotice,
    true,
  );
  if (!visible) {
    return null;
  }

  return <DisplayPendingNotice styleType={styleType} onClose={handleClose} />;
}
