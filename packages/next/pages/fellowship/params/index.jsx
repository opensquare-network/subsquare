import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import FellowshipParamsOffBoardTimeoutCard from "next-common/components/fellowship/params/off-boardTimeout";
import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipParamsApi } from "next-common/services/url";
import { withCommonProps } from "next-common/lib";

export default function FellowshipParamsPage() {
  const title = "Fellowship Params";
  const seoInfo = { title };

  return (
    <ListLayout seoInfo={seoInfo} title={title}>
      <div className="space-y-4">
        <FellowshipParamsOffBoardTimeoutCard />
      </div>
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const tracksProps = await fetchOpenGovTracksProps();
  const { result: fellowshipParams } = await ssrNextApi.fetch(
    fellowshipParamsApi,
  );

  return {
    props: {
      ...tracksProps,
      fellowshipParams: fellowshipParams || {},
    },
  };
});
