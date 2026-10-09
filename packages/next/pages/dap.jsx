import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import DapPageContent from "next-common/components/dap";

const isDapSupported = !!getChainSettings(CHAIN).modules?.dap;

export default function DapPage() {
  return isDapSupported ? <DapPageContent /> : null;
}

export const getServerSideProps = async (context) => {
  if (!isDapSupported) {
    return { notFound: true };
  }
  return withCommonProps()(context);
};
