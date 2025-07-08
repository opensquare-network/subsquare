import React from "react";

import SystemUser from "next-common/components/user/systemUser";
import AddressUser from "next-common/components/user/addressUser";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";

export default function PostItemUser({ data }) {
  const { sm } = useScreenSize();
  const userMaxWidth = sm ? 160 : 240;

  if (data?.author) {
    return (
      <SystemUser
        user={data?.author}
        className="text12Medium text-textPrimary"
        maxWidth={userMaxWidth}
      />
    );
  }

  return (
    <AddressUser
      add={data.address || data.proposer}
      className="text12Medium text-textPrimary"
      maxWidth={userMaxWidth}
    />
  );
}
