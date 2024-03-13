import TimelineItemInfoHeader from "./itemHeader";

export default function TimelineItemInfo({ data, item, FieldsComponent }) {
  return (
    <div className="flex max-sm:flex-col">
      <TimelineItemInfoHeader item={item} />
      <FieldsComponent data={data} item={item} />
    </div>
  );
}
