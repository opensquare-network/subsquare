import { preImagesTriggerSelector } from "next-common/store/reducers/preImagesSlice";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useSelector } from "react-redux";

export default function usePreimageHashs({ myDepositOnly = false } = {}) {
  const realAddress = useRealAddress();
  const trigger = useSelector(preImagesTriggerSelector);

  const api = useApi();
  const [allStatus] = useCall(api?.query.preimage?.statusFor.entries, [], {
    trigger,
  });

  const entries = allStatus?.map((item) => {
    const [
      {
        args: [hash],
      },
      status,
    ] = item;

    return [hash.toJSON(), status.toJSON()];
  });

  if (myDepositOnly && realAddress) {
    return entries?.filter(([, status]) => {
      const { deposit } = parseStatus(status);
      const [who] = deposit || [];

      return who === realAddress;
    });
  }

  return entries;
}

function parseStatus(status) {
  const statusName = Object.keys(status || {})[0];
  if (!statusName) return {};
  const { deposit = [] } = status[statusName];
  return {
    statusName,
    deposit,
  };
}
