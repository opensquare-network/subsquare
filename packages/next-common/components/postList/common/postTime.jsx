import React from "react";
import { Info } from "../styled";
import Flex from "next-common/components/styled/flex";
import Tooltip from "next-common/components/tooltip";
import { SystemActivity } from "@osn/icons/subsquare";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";

export default function PostTime({ data, elapseIcon }) {
  const timeAgo = formatTimeAgo(data?.time);
  const createAgo = formatTimeAgo(data?.createdAt);

  if (!data.time) {
    return null;
  }

  return (
    <Info>
      <SystemActivity className="w-4 h-4 stroke-textTertiary [&_path]:stroke-2 mr-1" />
      <Tooltip
        className="flex"
        content={
          <div className="text12Medium">
            <ul className="list-disc list-inside">
              <li>Created at {createAgo}</li>
              <li>Latest activity at {timeAgo}</li>
            </ul>
          </div>
        }
      >
        <span className="cursor-pointer">{timeAgo}</span>
      </Tooltip>
      <Flex className="elapseIcon">{elapseIcon}</Flex>
    </Info>
  );
}
