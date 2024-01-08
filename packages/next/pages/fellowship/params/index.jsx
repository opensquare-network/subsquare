import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import FellowshipParamsOffBoardTimeoutCard from "next-common/components/fellowship/params/off-boardTimeout";
import FellowshipParamsList from "next-common/components/fellowship/params/list";
import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipParamsApi } from "next-common/services/url";
import { withCommonProps } from "next-common/lib";
import Select from "next-common/components/select";
import { useState } from "react";

export default function FellowshipParamsPage({ fellowshipParams }) {
  const title = "Fellowship Params";
  const seoInfo = { title };

  const options = [
    {
      label: "-",
      value: "",
    },
    ...(fellowshipParams?.activeSalary || []).map((_, idx) => {
      return {
        label: idx + 1,
        value: idx,
      };
    }),
  ];
  const [rank, setRank] = useState(options[0].value);

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      titleExtra={
        <div className="text12Medium text-textPrimary flex items-center gap-x-2">
          <div>Rank</div>
          <Select
            className="w-20"
            small
            value={rank}
            options={options}
            onChange={(option) => {
              setRank(option.value);
            }}
          />
        </div>
      }
    >
      <div className="space-y-4">
        <FellowshipParamsList rank={rank} />
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
