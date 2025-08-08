import { useState, useEffect } from "react";
import { useChain } from "next-common/context/chain";
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

const foreignAssetQuery = gql`
  query MyQuery($assetId: String!) {
    foreignAsset(id: $assetId) {
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

// TODO: use chain settings
const STATESCAN_CHAIN_URL_MAP = Object.freeze({
  "polkadot-assethub": "https://ahp-gh-api.statescan.io/graphql",
  "kusama-assethub": "https://statemine-gh-api.statescan.io/graphql",
});

export default function useForeignAssetTransfers(
  address,
  page = 0,
  page_size = 25,
) {
  const chain = useChain();

  const [value, setValue] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!STATESCAN_CHAIN_URL_MAP[chain]) {
      setError(new Error(`Chain ${chain} is not supported.`));
      setLoading(false);
      return;
    }

    const fetchTransfersData = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = STATESCAN_CHAIN_URL_MAP[chain];
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
          return request(url, foreignAssetQuery, {
            assetId: asset.assetId,
          });
        });

        const metadataResults = await Promise.all(metadataPromises);

        const metadataMap = new Map();
        uniqueAssets.forEach((asset, index) => {
          metadataMap.set(
            asset.assetId,
            metadataResults[index]?.foreignAsset?.metadata,
          );
        });

        transfers.forEach((transfer) => {
          transfer.metadata = metadataMap.get(transfer.assetId);
        });

        setValue(transfers);
      } catch (err) {
        setError(err);
        console.error("Error fetching transfers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfersData();
  }, [page, page_size, address, chain]);

  return { value, total, loading, error };
}
