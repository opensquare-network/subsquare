import { memo } from "react";
import { MapDataList } from "next-common/components/dataList";
import {
  memberColumn,
  rankColumn,
} from "next-common/components/fellowship/core/batchBump/columns";
import Popup from "next-common/components/popup/wrapper/Popup";

function UserListPopup({ users, isLoading, onClose }) {
  const columnsDef = [rankColumn, memberColumn];

  return (
    <Popup title="Eligible Members" onClose={onClose}>
      <div className="max-h-[450px]">
        <MapDataList
          columnsDef={columnsDef}
          data={users}
          loading={isLoading}
          noDataText="No members can be demoted."
          className="max-h-[450px] overflow-auto"
        />
      </div>
    </Popup>
  );
}

export default memo(UserListPopup);
