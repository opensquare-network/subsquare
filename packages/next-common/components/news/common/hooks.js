import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";

export const useEcoNewsData = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getItems = async () => {
    setLoading(true);
    const { result } = await nextApi.fetch("eco-news").finally(() => {
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
