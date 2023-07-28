import ListTitleBar from "next-common/components/listTitleBar";
import PreImagesTable from "./table";
import SearchBox from "./searchBox";
import { useState } from "react";

export default function PreImagesList({ data }) {
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className="flex flex-col gap-[16px]">
      <ListTitleBar
        title="List"
        titleCount={data?.length}
        titleExtra={<SearchBox value={searchValue} setValue={setSearchValue} />}
      />
      <PreImagesTable data={data} searchValue={searchValue} />
    </div>
  );
}
