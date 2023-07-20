import React from "react";
import ListLayout from "next-common/components/layout/ListLayout";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { withLoginUserRedux } from "../../lib";
import { isPolkadotAddress } from "../../utils/viewfuncs";
import Bio from "./bio";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { addressEllipsis } from "next-common/utils";
import Posted from "./posted";
import { useRouter } from "next/router";
import VotingHistory from "./votngHistory";

export default withLoginUserRedux(({ user, id }) => {
  const address =
    isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;

  const breadcrumbItems = [
    {
      content: "Profile",
    },
    {
      content: addressEllipsis(id),
    },
  ];

  const router = useRouter();

  let tabContent = <Posted />;
  if (router.asPath.startsWith(`/user/${id}/votes`)) {
    tabContent = <VotingHistory />;
  }

  return (
    <ListLayout
      header={
        <>
          <BreadcrumbWrapper>
            <Breadcrumb items={breadcrumbItems} />
          </BreadcrumbWrapper>
          <Bio address={address} user={user} id={id} />
        </>
      }
      tabs={[
        {
          label: "Posted",
          url: `/user/${id}/posted`,
          exactMatch: false,
        },
        {
          label: "Votes",
          url: `/user/${id}/votes`,
        },
      ]}
    >
      {tabContent}
    </ListLayout>
  );
});
