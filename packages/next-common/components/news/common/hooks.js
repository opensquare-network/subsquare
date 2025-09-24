import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import Api from "next-common/services/api";
import { isPolkadotChain } from "next-common/utils/chain";
import { CHAIN } from "next-common/utils/constants";

const polkadotApi = new Api("https://polkadot-api.subsquare.io");

export const useEcoNewsData = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getItems = async () => {
    setLoading(true);
    const { result } = await (isPolkadotChain(CHAIN) ? nextApi : polkadotApi)
      .fetch("eco-news")
      .finally(() => {
        setLoading(false);
      });
    setItems(result);
  };

  useEffect(() => {
    getItems();
  }, []);
  return {
    items,
    loading,
    refresh: getItems,
    setItems,
  };
};

export const useEcoNewsReviewData = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getItems = async () => {
    setLoading(true);
    const { result } = await nextApi.fetch("eco-news/review").finally(() => {
      setLoading(false);
    });
    setItems(result);
  };

  useEffect(() => {
    getItems();
  }, []);
  return {
    items,
    loading,
    refresh: getItems,
    setItems,
  };
};
