import React from "react";
import {
  colId,
  colName,
  colToken,
  colTotal,
  colTransferrable,
} from "next-common/components/assethubMigrationAssets/assetsList";
import SubscribedAssetsList from "next-common/components/assethubMigrationAssets/subscribedAssetsList";

const columnsDef = [colToken, colName, colId, colTotal, colTransferrable];

export default function ProfileAssetsList({ address }) {
  return <SubscribedAssetsList address={address} columnsDef={columnsDef} />;
}
