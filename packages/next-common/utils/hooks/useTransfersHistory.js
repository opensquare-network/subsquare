import { useState, useEffect } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { gql, request } from "graphql-request";

export const assetTransfersQuery = gql`
  query MyQuery($limit: Int!, $offset: Int!, $address: String!) {
    assetTransfers(limit: $limit, offset: $offset, address: $address) {
      transfers {
        assetId
        assetHeight
        balance
        from
        to
        indexer {
          blockTime
        }
      }
      total
    }
  }
`;

export const assetMetadataQuery = gql`
  query MyQuery($id: Int!, $height: Int!) {
    asset(id: $id, height: $height) {
      metadata {
        decimals
        symbol
      }
    }
  }
`;

const STATESCAN_CHAIN_URL_MAP = Object.freeze({
  "polkadot-assethub": "https://statemint-gh-api.statescan.io/graphql",
});

export default function useTransfersHistory(page = 0, page_size = 25) {
  const address = useRealAddress();
  const chain = useChain();

  const [value, setValue] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (chain !== Chains.polkadotAssetHub) {
        setError(new Error(`Chain ${chain} is not supported.`));
        setLoading(false);
        return;
      }

      try {
        const url = STATESCAN_CHAIN_URL_MAP[chain];

        const transfersData = await request(url, assetTransfersQuery, {
          limit: page_size,
          offset: page * page_size,
          address,
        });

        const transfers = transfersData?.assetTransfers?.transfers || [];
        const totalTransfers = transfersData?.assetTransfers?.total || 0;

        const metadataPromises = transfers.map((transfer) =>
          request(url, assetMetadataQuery, {
            id: transfer.assetId,
            height: transfer.assetHeight,
          }).then((metadataData) => ({
            ...transfer,
            metadata: metadataData?.asset?.metadata,
          })),
        );

        const transfersWithMetadata = await Promise.all(metadataPromises);

        setValue(transfersWithMetadata);
        setTotal(totalTransfers);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, page_size, address, chain]);

  return { value, total, loading, error };
}
