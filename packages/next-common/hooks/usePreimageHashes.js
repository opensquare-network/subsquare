import { preImagesTriggerSelector } from "next-common/store/reducers/preImagesSlice";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useSelector } from "react-redux";

export default function usePreimageHashes() {
  const trigger = useSelector(preImagesTriggerSelector);
  console.log("usePreimageHashes", trigger);

  const api = useApi();
  const [allStatus] = useCall(api?.query.preimage?.statusFor.entries, [], {
    trigger,
  });

  return allStatus?.map((item) => {
    const [
      {
        args: [hash],
      },
      status,
    ] = item;
    return [hash.toJSON(), status.toJSON()];
  });
}
