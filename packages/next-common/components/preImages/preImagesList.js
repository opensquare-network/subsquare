import ListTitleBar from "next-common/components/listTitleBar";
import PreImagesTable from "./table";
import SearchBox from "./searchBox";
import { useState } from "react";
import MyDeposit from "./myDeposit";
import { useUser } from "next-common/context/user";

export default function PreImagesList({ data }) {
  const [searchValue, setSearchValue] = useState("");
  const [isMyDepositOn, setIsMyDepositOn] = useState(false);
  const user = useUser();

  const titleExtra = (
    <div className="flex items-center gap-[24px]">
      {user && <MyDeposit isOn={isMyDepositOn} setIsOn={setIsMyDepositOn} />}
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
        isMyDepositOn={user && isMyDepositOn}
      />
    </div>
  );
}
