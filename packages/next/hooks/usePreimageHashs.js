import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";

export default function usePreimageHashs() {
  const api = useApi();
  const [allStatus] = useCall(api?.query.preimage?.statusFor.entries, []);
  return allStatus?.map((item) => {
    const [
      {
        args: [hash],
      },
    ] = item;
    return hash.toJSON();
  });
}
