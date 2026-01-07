import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import ValidatorsList from "next-common/components/staking/validatorsList";
import StakingValidatorsSummary from "next-common/components/staking/validatorsList/summary";

const isStakingSupported = !!getChainSettings(CHAIN).modules?.staking;

export default function ValidatorsPageImpl() {
  if (!isStakingSupported) {
    return null;
  }

  return (
    <ListLayout
      title={"Validators"}
      seoInfo={{ title: "" }}
      description={
        "Displays and manages validators with search, filtering, and sorting features for staking."
      }
      summary={<StakingValidatorsSummary />}
    >
      <ValidatorsList />
    </ListLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isStakingSupported) {
    return {
      notFound: true,
    };
  }

  return withCommonProps(async () => {
    return {
      props: {},
    };
  })(ctx);
};
