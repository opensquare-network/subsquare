import { useMemo } from "react";
import { useAsync } from "react-use";
import { fetchTreasuryItemData } from "next-common/services/treasuryItemsData";
import LoadableContent from "next-common/components/common/loadableContent";
import Link from "next-common/components/link";
import BigNumber from "bignumber.js";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

const RequestColumnsDef = {
  name: "Request",
  style: { textAlign: "right", width: "100px" },
  render: (item) => <RequestCol item={item} />,
};

function PostTitle({ index, apiPath, normalizeItem, isTip = false }) {
  const { value: data, loading } = useAsync(async () => {
    const response = await fetchTreasuryItemData(apiPath, index);
    return normalizeItem(null, response);
  }, [index, apiPath, normalizeItem]);

  if (isTip) {
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
      <span>#{index}</span>
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

function createTitleColumnDef({
  getIndex,
  apiPath,
  normalizeItem,
  isTip = false,
}) {
  return {
    name: "Title",
    className: "flex-1 whitespace-nowrap overflow-hidden text-ellipsis pr-2",
    style: { textAlign: "left" },
    render: (item) => {
      const index = getIndex(item);
      return (
        <PostTitle
          index={index}
          apiPath={apiPath}
          normalizeItem={normalizeItem}
          isTip={isTip}
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
  isTip = false,
}) {
  const titleColumnDef = useMemo(
    () => createTitleColumnDef({ getIndex, apiPath, normalizeItem, isTip }),
    [getIndex, apiPath, normalizeItem, isTip],
  );

  return useMemo(() => [titleColumnDef, RequestColumnsDef], [titleColumnDef]);
}
