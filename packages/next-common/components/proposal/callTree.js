import { useEffect, useState } from "react";
import CallTreeView from "../callTreeView";
import Loading from "../loading";
import usePreImageCall from "./preImage";
import nextApi from "next-common/services/nextApi";

function usePreImage(preImageHash) {
  const [preImage, setPreImage] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!preImageHash) {
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();
    setTimeout(() => {
      abortController.abort();
    }, 15 * 1000);
    nextApi
      .fetch(
        `preimages/${preImageHash}`,
        {},
        { signal: abortController.signal },
      )
      .then(({ result, error }) => {
        if (error) {
          return;
        }

        setPreImage(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [preImageHash]);

  return { preImage, isLoading };
}

export default function CallTree({ preImageHash }) {
  const { preImage, isLoading: isLoadingPreImage } = usePreImage(preImageHash);
  const { call, isLoading: isLoadingCall } = usePreImageCall(
    preImage,
    isLoadingPreImage,
  );

  if (isLoadingCall) {
    return (
      <div className="flex justify-center py-[24px]">
        <Loading size={20} />
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex justify-center py-[24px] text-textTertiary text14Medium">
        <span>Fail to parse</span>
      </div>
    );
  }

  return <CallTreeView proposal={call} />;
}
