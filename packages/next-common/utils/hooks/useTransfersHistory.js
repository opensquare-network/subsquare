import { useState, useEffect } from "react";
import { useChain } from "next-common/context/chain";
import { gql, request } from "graphql-request";
import { getStatescanGraphqlUrl } from "next-common/utils/statescan";

const assetTransfersQuery = gql`
  query MyQuery($limit: Int!, $offset: Int!, $address: String!) {
    assetTransfers(limit: $limit, offset: $offset, address: $address) {
      transfers {
        assetId
        assetHeight
        balance
        from
        to
        indexer {
          blockHeight
          extrinsicIndex
          eventIndex
          blockTime
        }
      }
      total
    }
  }
`;

const assetMetadataQuery = gql`
  query MyQuery($id: Int!, $height: Int!) {
    asset(id: $id, height: $height) {
      metadata {
        decimals
        symbol
      }
    }
  }
`;

const STATESCAN_CHAIN_SUB_DOMAIN_MAP = Object.freeze({
  polkadot: "ahp-gh-api",
  westend: "westmint-gh-api",
  kusama: "statemine-gh-api",
});

export default function useTransfersHistory(address, page = 0, page_size = 25) {
  const chain = useChain();

  const [value, setValue] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = getStatescanGraphqlUrl(STATESCAN_CHAIN_SUB_DOMAIN_MAP[chain]);
    if (!url) {
      setError(new Error(`Chain ${chain} is not supported.`));
      setLoading(false);
      return;
    }

    const fetchTransfersData = async () => {
      try {
        setLoading(true);
        setError(null);

        const transfersData = await request(url, assetTransfersQuery, {
          limit: page_size,
          offset: page * page_size,
          address,
        });

        const transfers = transfersData?.assetTransfers?.transfers || [];
        setTotal(transfersData?.assetTransfers?.total || 0);

        const uniqueAssetKeys = new Set();
        const uniqueAssets = [];

        transfers.forEach((transfer) => {
          const key = `${transfer.assetId}_${transfer.assetHeight}`;
          if (!uniqueAssetKeys.has(key)) {
            uniqueAssetKeys.add(key);
            uniqueAssets.push({
              assetId: transfer.assetId,
              assetHeight: transfer.assetHeight,
            });
          }
        });

        const metadataPromises = uniqueAssets.map((asset) => {
          return request(url, assetMetadataQuery, {
            id: asset.assetId,
            height: asset.assetHeight,
          });
        });

        const metadataResults = await Promise.all(metadataPromises);

        const metadataMap = new Map();
        uniqueAssets.forEach((asset, index) => {
          metadataMap.set(
            `${asset.assetId}_${asset.assetHeight}`,
            metadataResults[index]?.asset?.metadata,
          );
        });

        transfers.forEach((transfer) => {
          const key = `${transfer.assetId}_${transfer.assetHeight}`;
          transfer.metadata = metadataMap.get(key);
        });

        setValue(transfers);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfersData();
  }, [page, page_size, address, chain]);

  return { value, total, loading, error };
}
