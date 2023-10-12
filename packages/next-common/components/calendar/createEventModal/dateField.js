import dayjs from "dayjs";
import noop from "lodash.noop";
import React from "react";
import Labeled from "../../../components/Labeled";
import Flex from "../../styled/flex";
import RightSVG from "./right.svg";

export default function DateField({
  title = "Date",
  optional,
  value,
  onClick = noop,
}) {
  return (
    <Labeled text={title} status={optional && "Optional"}>
      <div className="flex border border-neutral400 rounded overflow-hidden text14Medium leading-none">
        <div className="flex items-center py-2.5 px-4 bg-neutral200 text14Medium text-textPrimary whitespace-nowrap">
          {title}
        </div>
        <Flex className="flex-1 cursor-pointer" onClick={onClick}>
          <div className="text14Medium leading-none py-3 px-4 grow bg-neutral100 text-textTertiary">
            {value
              ? dayjs(value).format("YYYY-MM-DD HH:mm")
              : "Please select the time..."}
          </div>
          <Flex className="mr-4 ml-2">
            <RightSVG className="[&_path]:stroke-textPrimary" />
          </Flex>
        </Flex>
      </div>
    </Labeled>
  );
}
