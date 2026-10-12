import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import DotUsdPageContent from "next-common/components/dotusd";

const isDotUsdSupported = !!getChainSettings(CHAIN).modules?.dotusd;

export default function DotUsdPage() {
  return isDotUsdSupported ? <DotUsdPageContent /> : null;
}

export const getServerSideProps = async (context) => {
  if (!isDotUsdSupported) {
    return { notFound: true };
  }
  return withCommonProps()(context);
};
