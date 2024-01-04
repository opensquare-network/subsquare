import ListLayout from "next-common/components/layout/ListLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import FellowshipOffBoardTimeoutCard from "next-common/components/fellowship/params/off-boardTimeout";
import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipParamsApi } from "next-common/services/url";

export default function FellowshipParamsPage() {
  const title = "Fellowship Params";
  const seoInfo = { title };

  return (
    <ListLayout seoInfo={seoInfo} title={title}>
      <div className="space-y-4">
        <FellowshipOffBoardTimeoutCard />
      </div>
    </ListLayout>
  );
}

export const getServerSideProps = async (context) => {
  const resp = await getServerSidePropsWithTracks(context);
  const { result: fellowshipParams } = await ssrNextApi.fetch(
    fellowshipParamsApi,
  );

  console.log(1, fellowshipParams);

  return {
    props: {
      ...resp.props,
      fellowshipParams: fellowshipParams || {},
    },
  };
};
