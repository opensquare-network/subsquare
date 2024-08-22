import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";

export default function useAssetHubTransfersHistory(page = 0, page_size = 25) {
  // const { value: value, loading } = useAsync(async () => {
  //   const url = `https://statemint-api.statescan.io/accounts/15PWs66SguKkvRXBdxSoSWbicXfxQQ9qiSxiU6GNzJDfzqA7/transfers`;

  //   const response = await nextApi.fetch(url, {
  //     page,
  //     page_size,
  //   });

  //   return response?.result;
  // }, [page, page_size]);

  // return { value, loading };
  return {
    value: {
      "items": [
        {
          "indexer": {
            "blockHeight": 6952530,
            "blockHash": "0xf5109fee6a9f828dd158efb8b075c70cb90fff6c421e0bcf20216aa395abcecb",
            "blockTime": 1724227788000,
            "eventIndex": 5,
            "extrinsicIndex": 2
          },
          "assetId": 1984,
          "from": "15PWs66SguKkvRXBdxSoSWbicXfxQQ9qiSxiU6GNzJDfzqA7",
          "to": "16V5YQ989Ch4fNhvFUaBAd4aXvd2DAkLzRyrNo5g1FGJHZgJ",
          "balance": "20000",
          "isSigned": true,
          "assetModule": 1,
          "assetHeight": 1225717,
          "isNativeAsset": false,
          "symbol": "USDt",
          "decimals": 6
        },
        {
          "indexer": {
            "blockHeight": 6952530,
            "blockHash": "0xf5109fee6a9f828dd158efb8b075c70cb90fff6c421e0bcf20216aa395abcecb",
            "blockTime": 1724227788000,
            "eventIndex": 5,
            "extrinsicIndex": 2
          },
          "assetId": 1984,
          "from": "15PWs66SguKkvRXBdxSoSWbicXfxQQ9qiSxiU6GNzJDfzqA7",
          "to": "16V5YQ989Ch4fNhvFUaBAd4aXvd2DAkLzRyrNo5g1FGJHZgJ",
          "balance": "20000",
          "isSigned": true,
          "assetModule": 1,
          "assetHeight": 1225717,
          "isNativeAsset": false,
          "symbol": "USDt",
          "decimals": 6
        },
        {
          "indexer": {
            "blockHeight": 6669010,
            "blockHash": "0xaee83093d65a2b5e5343eadc6aa24f40a09c16b611238f01c7046851afb38329",
            "blockTime": 1720767816000,
            "eventIndex": 4,
            "extrinsicIndex": 2
          },
          "assetId": 30,
          "from": "13osrVVV5zGSCeav6tzQmc9Z2MHbFTwne7SDfA5Vgar2jjza",
          "to": "15PWs66SguKkvRXBdxSoSWbicXfxQQ9qiSxiU6GNzJDfzqA7",
          "balance": "304870058575300",
          "isSigned": true,
          "assetModule": 1,
          "assetHeight": 5889939,
          "isNativeAsset": false,
          "symbol": "DED",
          "decimals": 10
        },
      ],
      "page": 0,
      "pageSize": 25,
      "total": 17
    },
    loading: false,
  }
}
