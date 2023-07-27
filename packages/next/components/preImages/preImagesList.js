import ListTitleBar from "next-common/components/listTitleBar";
import PreImagesTable from "./table";

export default function PreImagesList({ data }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <ListTitleBar title="List" titleCount={data?.length} />
      <PreImagesTable data={data} />
    </div>
  );
}
