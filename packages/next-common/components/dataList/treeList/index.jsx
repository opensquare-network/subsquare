import DataList from "../index";

export default function TreeMapDataList({
  treeKey = "children",
  data,
  columnsDef,
  getRowKey,
  ...props
}) {
  const rows = (data || []).map((item, index) => {
    const row = columnsDef.map(({ render }) => render(item));
    row.key = getRowKey ? getRowKey(item) : index;
    return row;
  });

  return (
    <DataList
      columns={columnsDef}
      rows={rows}
      {...props}
      treeKey={treeKey}
      treeData={data}
      tree={true}
    />
  );
}
