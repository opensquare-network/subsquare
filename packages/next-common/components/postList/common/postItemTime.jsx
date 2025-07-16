import React from "react";
import { Info } from "../styled";
import Flex from "next-common/components/styled/flex";
import Tooltip from "next-common/components/tooltip";
import { SystemActivity } from "@osn/icons/subsquare";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";
import formatTime from "next-common/utils/viewfuncs/formatDate";

export default function PostItemTime({ data, elapseIcon }) {
  const activeAgo = formatTimeAgo(data?.time);
  const activeTime = formatTime(data?.time);
  const createTime = formatTime(data?.createdAt);

  if (!data.time) {
    return null;
  }

  return (
    <Info>
      <Tooltip
        className="flex"
        content={
          <div className="text12Medium">
            <ul className="list-disc list-inside">
              <li>Created at {createTime}</li>
              <li>Latest activity at {activeTime}</li>
            </ul>
          </div>
        }
      >
        <SystemActivity className="w-4 h-4 stroke-textTertiary [&_path]:stroke-2 mr-1" />
        <span className="cursor-pointer">{activeAgo}</span>
      </Tooltip>
      {elapseIcon && <Flex className="elapseIcon">{elapseIcon}</Flex>}
    </Info>
  );
}
