import { useState, useEffect } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChain } from "next-common/context/chain";
import { gql, request } from "graphql-request";

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
        const transfersData = await request(url, assetTransfersQuery, {
          limit: page_size,
          offset: page * page_size,
          address,
        });

        const transfers = transfersData?.assetTransfers?.transfers || [];
        setTotal(transfersData?.assetTransfers?.total || 0);

        const transfersWithMetadata = await Promise.all(
          transfers.map(async (transfer) => {
            const metadataData = await request(url, assetMetadataQuery, {
              id: transfer.assetId,
              height: transfer.assetHeight,
            });
            return {
              ...transfer,
              metadata: metadataData?.asset?.metadata,
            };
          }),
        );

        setValue(transfersWithMetadata);
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
