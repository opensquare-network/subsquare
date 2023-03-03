import React from "react";
import isNil from "lodash.isnil";
import HashItem from "./hashItem";
import IndexItem from "./indexItem";

export default function MotionIndexItem({ motionHash, data, baseUrl }) {
  if (isNil(data?.motion?.index)) {
    return <HashItem hash={motionHash} />;
  } else {
    return <IndexItem index={data?.motion?.index} baseUrl={baseUrl} />;
  }
}
