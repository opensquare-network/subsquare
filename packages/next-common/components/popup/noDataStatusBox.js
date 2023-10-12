import React from "react";

import { GreyPanel } from "../styled/containers/greyPanel";
import NoData from "../noData";
import { cn } from "next-common/utils";

export default function NoDataStatusBox({ text }) {
  return (
    <GreyPanel>
      <NoData
        showIcon={false}
        text={text}
        className={cn("w-full", "!py-4 !px-3")}
      />
    </GreyPanel>
  );
}
