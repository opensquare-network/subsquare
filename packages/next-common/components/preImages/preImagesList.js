import ListTitleBar from "next-common/components/listTitleBar";
import PreImagesTable from "./table";
import SearchBox from "./searchBox";
import { useState } from "react";
import MyDeposit from "./myDeposit";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import usePreimageHashs from "next-common/hooks/usePreimageHashs";

export default function PreImagesList() {
  const [searchValue, setSearchValue] = useState("");
  const [isMyDepositOn, setIsMyDepositOn] = useState(false);
  const realAddress = useRealAddress();
  const data = usePreimageHashs({ myDepositOnly: isMyDepositOn });

  const titleExtra = (
    <div className="flex items-center gap-[24px]">
      {realAddress && (
        <MyDeposit isOn={isMyDepositOn} setIsOn={setIsMyDepositOn} />
      )}
      <SearchBox value={searchValue} setValue={setSearchValue} />
    </div>
  );

  return (
    <div className="flex flex-col gap-[16px]">
      <ListTitleBar
        title="List"
        titleCount={data?.length}
        titleExtra={titleExtra}
      />
      <PreImagesTable
        data={data}
        searchValue={searchValue}
        isMyDepositOn={realAddress && isMyDepositOn}
      />
    </div>
  );
}
