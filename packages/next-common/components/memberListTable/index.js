import Descriptions from "../Descriptions";
import StyledList from "../styledList";
import Loading from "../loading";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import { NeutralPanel } from "../styled/containers/neutralPanel";

const loadingContent = (
  <div className="mt-4 mb-2 flex justify-center">
    <Loading size={24} />
  </div>
);

export default function MemberListTable({
  columns = [],
  rows = [],
  loading = false,
  noDataText = "No current members",
  ...restProps
}) {
  const { sm } = useScreenSize();

  return sm ? (
    <MobileList rows={rows} columns={columns} loading={loading} />
  ) : (
    <StyledList
      columns={columns}
      rows={rows}
      loading={loading}
      noDataText={noDataText}
      {...restProps}
    />
  );
}

function MobileList({ rows = [], columns = [], loading }) {
  if (loading) {
    return loadingContent;
  }

  return (
    <NeutralPanel className="p-6">
      {rows.map((row, idx) => {
        const title = row[0];
        const rest = row.slice(1);
        const descriptionsLabels = columns.slice(1).map((col) => col.name);

        const descriptionItems = rest.map((value, idx) => {
          return {
            label: (
              <span className="text-textTertiary">
                {descriptionsLabels[idx]}
              </span>
            ),
            value,
            className: "h-auto",
          };
        });

        return (
          <div
            key={idx}
            className="py-4 first:pt-0 border-b border-neutral300 space-y-3"
          >
            <div className="flex items-center">{title}</div>

            <Descriptions items={descriptionItems} bordered={false} />
          </div>
        );
      })}
    </NeutralPanel>
  );
}
