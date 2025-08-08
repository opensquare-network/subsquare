import { useState, useEffect, useCallback } from "react";
import { useChainSettings } from "next-common/context/chain";
import { gql, request } from "graphql-request";

const foreignAssetTransfersQuery = gql`
  query MyQuery($limit: Int!, $offset: Int!, $address: String!) {
    foreignAssetTransfers(limit: $limit, offset: $offset, address: $address) {
      total
      limit
      offset
      transfers {
        assetId
        balance
        from
        to
        indexer {
          blockHash
          blockHeight
          blockTime
          chain
          eventIndex
          extrinsicIndex
        }
      }
    }
  }
`;

const foreignAssetMetaDataQuery = gql`
  query MyQuery($assetId: String!) {
    foreignAsset(id: $assetId) {
      location
      metadata {
        decimals
        deposit
        isFrozen
        name
        symbol
      }
    }
  }
`;

export default function useForeignAssetTransfers(
  address,
  page = 0,
  page_size = 25,
) {
  const { supportForeignAssets, graphqlApiSubDomain } = useChainSettings();

  const [value, setValue] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTransfersData = useCallback(async () => {
    try {
      setLoading(true);

      const url = `https://${graphqlApiSubDomain}.statescan.io/graphql`;
      const transfersData = await request(url, foreignAssetTransfersQuery, {
        limit: page_size,
        offset: page * page_size,
        address,
      });

      const transfers = transfersData?.foreignAssetTransfers?.transfers || [];
      setTotal(transfersData?.foreignAssetTransfers?.total || 0);

      const uniqueAssetIds = new Set();
      const uniqueAssets = [];

      transfers.forEach((transfer) => {
        if (!uniqueAssetIds.has(transfer.assetId)) {
          uniqueAssetIds.add(transfer.assetId);
          uniqueAssets.push({
            assetId: transfer.assetId,
          });
        }
      });

      const metadataPromises = uniqueAssets.map((asset) => {
        return request(url, foreignAssetMetaDataQuery, {
          assetId: asset.assetId,
        });
      });

      const metadataResults = await Promise.all(metadataPromises);

      const metadataMap = new Map();
      uniqueAssets.forEach((asset, index) => {
        const { location, metadata } =
          metadataResults[index]?.foreignAsset || {};

        metadataMap.set(asset.assetId, {
          location,
          ...metadata,
        });
      });

      transfers.forEach((transfer) => {
        transfer.metadata = metadataMap.get(transfer.assetId);
      });

      setValue(transfers);
    } catch (err) {
      console.error("Error fetching transfers");
    } finally {
      setLoading(false);
    }
  }, [page, page_size, address, graphqlApiSubDomain]);

  useEffect(() => {
    if (!supportForeignAssets || !graphqlApiSubDomain) {
      setLoading(false);
      return;
    }

    fetchTransfersData();
  }, [fetchTransfersData, supportForeignAssets, graphqlApiSubDomain]);

  return { value, total, loading };
}
