import { useMemo } from "react";
import { useAsync } from "react-use";
import { fetchTreasuryItemData } from "next-common/services/treasuryItemsData";
import LoadableContent from "next-common/components/common/loadableContent";
import Link from "next-common/components/link";
import BigNumber from "bignumber.js";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { TYPES } from "../yearStatus/treasuryItemsList";

const RequestColumnsDef = {
  name: "Request",
  style: { textAlign: "right", width: "100px" },
  sortable: "desc,asc",
  render: (item) => <RequestCol item={item} />,
};

function PostTitle({
  displayIndex,
  requestIndex,
  apiPath,
  normalizeItem,
  type,
}) {
  const { value: data, loading } = useAsync(async () => {
    const response = await fetchTreasuryItemData(apiPath, requestIndex);
    return normalizeItem(null, response);
  }, [requestIndex, apiPath, normalizeItem]);

  if (type === TYPES.TIPS) {
    const tipTitle = data?.title || data?.hash;
    return (
      <Link
        className="hover:underline truncate max-w-[inherit] text-textPrimary"
        href={data?.detailLink}
        title={tipTitle}
      >
        {tipTitle}
      </Link>
    );
  }

  return (
    <div className="flex gap-x-1">
      <span>#{displayIndex ?? requestIndex}</span>
      <span className="text-textTertiary">·</span>
      <LoadableContent size={20} isLoading={loading}>
        <Link
          className="hover:underline truncate max-w-[inherit] text-textPrimary"
          href={data?.detailLink}
          title={data?.title ?? ""}
        >
          {data?.title ?? ""}
        </Link>
      </LoadableContent>
    </div>
  );
}

function createTitleColumnDef({ getIndex, apiPath, normalizeItem, type }) {
  return {
    name: "Title",
    className: "flex-1 whitespace-nowrap overflow-hidden text-ellipsis pr-2",
    style: { textAlign: "left" },
    render: (item) => {
      const { displayIndex, requestIndex } = getIndex(item);
      return (
        <PostTitle
          displayIndex={displayIndex ?? requestIndex}
          requestIndex={requestIndex}
          apiPath={apiPath}
          normalizeItem={normalizeItem}
          type={type}
        />
      );
    },
  };
}

function RequestCol({ item }) {
  const totalValue = BigNumber(item.fiatValueAtFinal ?? 0);

  return (
    <ValueDisplay
      value={toPrecision(totalValue)}
      symbol=""
      prefix="$"
      className="text14Medium text-textPrimary"
    />
  );
}

export default function useYearStatusColumnsDef({
  getIndex,
  apiPath,
  normalizeItem,
  type,
}) {
  const titleColumnDef = useMemo(
    () => createTitleColumnDef({ getIndex, apiPath, normalizeItem, type }),
    [getIndex, apiPath, normalizeItem, type],
  );

  return useMemo(() => [titleColumnDef, RequestColumnsDef], [titleColumnDef]);
}
