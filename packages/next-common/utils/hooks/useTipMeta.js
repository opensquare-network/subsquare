import { useEffect, useState } from "react";
import useApi from "./useApi";
import usePostTipMeta from "../../context/post/treasury/tip/tipMeta";
import useTipIsFinished from "../../context/post/treasury/tip/isFinished";
import { tipTriggerSelector } from "next-common/store/reducers/treasury/tip";
import { useSelector } from "react-redux";

export default function useTipMeta(tipHash) {
  const [isLoading, setIsLoading] = useState(true);
  const postTipMeta = usePostTipMeta();
  const [tipMeta, setTipMeta] = useState(postTipMeta);
  const api = useApi();
  const isFinished = useTipIsFinished();
  const tipTrigger = useSelector(tipTriggerSelector);

  useEffect(() => {
    if (!api || isFinished) {
      return;
    }

    setIsLoading(true);
    Promise.resolve(api)
      .then((api) => {
        if (api.query.tips) {
          return api.query.tips.tips(tipHash);
        } else if (api.query.treasury?.tips) {
          return api.query.treasury.tips(tipHash);
        }
      })
      .then((tip) => {
        if (tip) {
          setTipMeta(tip.toJSON());
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, tipHash, isFinished, tipTrigger]);

  return { isLoading, tipMeta };
}
