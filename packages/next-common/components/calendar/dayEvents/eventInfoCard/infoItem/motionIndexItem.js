import React from "react";
import { isNil } from "lodash-es";
import HashItem from "./hashItem";
import IndexItem from "./indexItem";

export default function MotionIndexItem({ motionHash, data, baseUrl }) {
  if (isNil(data?.motion?.index)) {
    return <HashItem hash={motionHash} baseUrl={baseUrl} />;
  } else {
    return <IndexItem index={data?.motion?.index} baseUrl={baseUrl} />;
  }
}
