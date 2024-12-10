import { isNil } from "lodash-es";
import { noop } from "lodash-es";
import DataList from "next-common/components/dataList";
import Pagination from "next-common/components/pagination";
import Tabs from "next-common/components/tabs";
import nextApi from "next-common/services/nextApi";
import { useState } from "react";
import { useUpdateEffect } from "react-use";

export default function FellowshipSalaryCycleDetailListTemplate({
  items = [],
  defaultTabValue,
  onTabClick = noop,
}) {
  const tabs = items.map((m) => {
    return {
      url: m.url,
      value: m.name,
      label: m.name,
      activeCount: m.activeCount,
      content: m.content || (
        <FellowshipSalaryCycleDetailListTemplateTable {...m} />
      ),
    };
  });
  const [activeTabValue, setActiveTabValue] = useState(
    defaultTabValue ?? tabs[0]?.value,
  );

  return (
    <div>
      <Tabs
        tabs={tabs}
        activeTabValue={activeTabValue}
        onTabClick={(tab) => {
          setActiveTabValue(tab.value);
          onTabClick(tab);
        }}
      />
    </div>
  );
}

export function FellowshipSalaryCycleDetailListTemplateTable({
  columns,
  api,
  formatter = (i) => i,
  noDataText,
}) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(api?.initData);
  const [loading, setLoading] = useState(!api?.initData ?? true);

  function fetchData() {
    if (api?.path) {
      nextApi
        .fetch(api?.path, { ...api.params, page, pageSize: result?.pageSize })
        .then((resp) => {
          if (resp.result) {
            setResult(resp.result);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  useUpdateEffect(fetchData, [page]);

  const rows = result?.items?.map((item) => {
    const formattedItem = formatter(item);
    return columns.map((col) =>
      col.cellRender?.(formattedItem, item, result.items),
    );
  });

  return (
    <div>
      <DataList
        loading={loading}
        columns={columns}
        rows={rows}
        noDataText={noDataText}
      />

      {!isNil(result?.page) && (
        <div className="mt-2">
          <Pagination
            page={page}
            pageSize={result?.pageSize}
            total={result?.total || 0}
            onPageChange={(e, newPage) => {
              e.preventDefault();
              setPage(newPage);
            }}
          />
        </div>
      )}
    </div>
  );
}
