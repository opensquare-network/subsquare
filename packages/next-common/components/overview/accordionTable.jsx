import last from "lodash.last";
import noop from "lodash.noop";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import Pagination from "../pagination";
import StyledList from "../styledList";

export default function OverviewAccordionTable({
  columns,
  rows = [],
  page,
  setPage = noop,
  pageSize,
  total,
  loading,
}) {
  const { sm } = useScreenSize();

  return (
    <div>
      {sm ? (
        <MobileList rows={rows} />
      ) : (
        <StyledList
          className="!shadow-none !border-none !p-0"
          columns={columns?.map((col) => ({
            ...col,
            name: (
              <div className="text14Medium tracking-normal">{col.name}</div>
            ),
          }))}
          loading={loading}
          rows={rows}
          noDataText="No active proposals"
        />
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total || 0}
        onPageChange={(e, newPage) => {
          e.preventDefault();
          setPage(newPage);
        }}
      />
    </div>
  );
}

function MobileList({ rows = [] }) {
  return (
    <div className="mb-4">
      {rows.map((row, idx) => {
        const title = row[0];
        const status = last(row);
        // without title and status
        const rest = row.slice(1, -1);

        return (
          <div
            key={idx}
            className="py-4 first:pt-0 border-b border-neutral300 space-y-3"
          >
            {title}
            <div className="flex items-center justify-between">
              {!!rest?.length && (
                <div className="flex">
                  {rest.map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      {item}
                      {idx !== rest.length - 1 && (
                        <span className="mx-2 text12Medium text-textTertiary">
                          ·
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {status}
            </div>
          </div>
        );
      })}
    </div>
  );
}
