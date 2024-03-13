import TimelineItem from "./item";
import Loading from "next-common/components/loading";

export default function Timeline({ data, timeline, loading, FieldsComponent }) {
  if (!timeline || loading) {
    return (
      <div className="flex items-center justify-center m-4">
        <Loading size={18} />
      </div>
    );
  }

  if (!timeline?.length) {
    return (
      <div className="flex items-center justify-center m-4 text14Medium text-textTertiary">
        No timeline data
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {(timeline || []).map((item, index) => (
        <TimelineItem
          key={index}
          data={data}
          item={item}
          isFirst={index === 0}
          isLast={index === timeline.length - 1}
          FieldsComponent={FieldsComponent}
        />
      ))}
    </div>
  );
}
