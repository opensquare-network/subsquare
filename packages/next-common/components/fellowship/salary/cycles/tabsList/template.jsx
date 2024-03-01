import isNil from "lodash.isnil";
import DataList from "next-common/components/dataList";
import Pagination from "next-common/components/pagination";
import Tabs from "next-common/components/tabs";
import nextApi from "next-common/services/nextApi";
import { useState } from "react";
import { useUpdateEffect } from "usehooks-ts";

export default function FellowshipSalaryCycleDetailListTemplate({
  items = [],
}) {
  const tabs = items.map((m) => {
    return {
      label: m.name,
      activeCount: m.activeCount,
      content: <TableTemplate {...m} />,
    };
  });
  const [activeTabLabel, setActiveTabLabel] = useState(tabs[0]?.label);

  return (
    <div>
      <Tabs
        tabs={tabs}
        activeTabLabel={activeTabLabel}
        onTabClick={(tab) => setActiveTabLabel(tab.label)}
      />
    </div>
  );
}

function TableTemplate({ columns, api, formatter = (i) => i }) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(api?.initData);
  const [loading, setLoading] = useState(!api?.initData ?? true);

  function fetchData() {
    if (api?.path) {
      nextApi
        .fetch(api?.path, { ...api.params, page })
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
      <DataList loading={loading} columns={columns} rows={rows} />

      {!isNil(result?.page) && (
        <div className="mt-2">
          <Pagination
            page={page}
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
