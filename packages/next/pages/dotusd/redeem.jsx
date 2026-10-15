import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import DotUsdRedeemRecords from "next-common/components/dotusd/redeemRecords";

const isDotUsdSupported = !!getChainSettings(CHAIN).modules?.dotusd;

export default function DotUsdRedeemRecordsPage() {
  return isDotUsdSupported ? <DotUsdRedeemRecords /> : null;
}

export const getServerSideProps = async (context) => {
  if (!isDotUsdSupported) {
    return { notFound: true };
  }
  return withCommonProps()(context);
};
