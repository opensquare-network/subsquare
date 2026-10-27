import Popup, { PopupSize } from "next-common/components/popup/wrapper/Popup";
import AddressUser from "next-common/components/user/addressUser";
import CopyButton from "next-common/components/copyButton";
import Tooltip from "next-common/components/tooltip";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { MapDataList } from "next-common/components/dataList";
import { useListPagination } from "next-common/components/pagination/usePaginationComponent";
import useLabelStoreDetail from "next-common/hooks/dotns/useLabelStoreDetail";
import { addressEllipsis } from "next-common/utils";
import { useMemo } from "react";
import { WebIdName } from "./common";

const PAGE_SIZE = 10;

function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-x-4">
      <span className="text14Medium text-textTertiary">{label}</span>
      <div className="flex items-center gap-x-1 text14Medium text-textPrimary">
        {children}
      </div>
    </div>
  );
}

export default function LabelStorePopup({ labelStore, onClose }) {
  const { detail, isLoading, error } = useLabelStoreDetail(labelStore);
  const labels = useMemo(() => detail?.labels || [], [detail]);
  const { pagedItems, component: pagination } = useListPagination(
    labels,
    PAGE_SIZE,
    { buttonMode: true },
  );

  const columnsDef = [
    {
      name: "Name",
      className: "text-left",
      render: (label) => <WebIdName label={label} />,
    },
  ];

  const noDataText = error ? "Failed to load labels" : "No labels";

  return (
    <Popup title="Label Store" onClose={onClose} size={PopupSize.MIDDLE}>
      <div className="space-y-2">
        <InfoRow label="Address">
          <Tooltip content={labelStore}>
            <span>{addressEllipsis(labelStore)}</span>
          </Tooltip>
          <CopyButton copyText={labelStore} />
        </InfoRow>
        <InfoRow label="Owner">
          {isLoading ? (
            <FieldLoading size={20} />
          ) : detail?.owner ? (
            <AddressUser add={detail.owner} />
          ) : (
            "-"
          )}
        </InfoRow>
        <InfoRow label="Labels Count">
          {isLoading ? (
            <FieldLoading size={20} />
          ) : (
            detail?.labels?.length ?? "-"
          )}
        </InfoRow>
      </div>

      <MapDataList
        className="max-h-[60vh]"
        columnsDef={columnsDef}
        data={pagedItems}
        getRowKey={(label) => label}
        loading={isLoading}
        noDataText={noDataText}
      />
      {labels.length > PAGE_SIZE && pagination}
    </Popup>
  );
}
