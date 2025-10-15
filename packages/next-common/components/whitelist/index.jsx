import useWhitelist from "next-common/hooks/useWhitelist";
import { useState } from "react";
import PreImageDetailPopup from "../preImages/preImageDetailPopup";
import ListTitleBar from "../listTitleBar";
import List from "./list";

export default function Whitelist() {
  const data = useWhitelist();
  const [showArgumentsDetail, setShowArgumentsDetail] = useState();

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex max-md:flex-col items-center gap-[24px] max-md:px-[24px] max-md:gap-[8px] mr-6 max-md:mr-0">
        <div className="flex grow justify-between max-md:w-full">
          <ListTitleBar
            className={"max-md:-ml-6"}
            title="List"
            titleCount={data?.length || 0}
          />
        </div>
      </div>
      <List data={data} setShowArgumentsDetail={setShowArgumentsDetail} />
      {showArgumentsDetail && (
        <PreImageDetailPopup
          setShow={() => setShowArgumentsDetail(null)}
          proposal={showArgumentsDetail}
        />
      )}
    </div>
  );
}
