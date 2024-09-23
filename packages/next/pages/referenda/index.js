import { withCommonProps } from "next-common/lib";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import nextApi from "next-common/services/nextApi";
import {
  gov2ReferendumsApi,
  gov2ReferendumsSummaryApi,
  gov2TracksApi,
} from "next-common/services/url";
import { camelCase, upperFirst } from "lodash-es";
import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { useState } from "react";
import useFetchMyReferendaVoting from "components/myvotes/referenda/useFetchMyReferendaVoting";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import {
  FullList,
  UnVotedOnlyList,
} from "next-common/components/referenda/list";

export default function ReferendaPage({ title, gov2ReferendaSummary }) {
  useFetchMyReferendaVoting();

  const [isShowUnVotedOnly, setIsShowUnVotedOnly] = useState(false);
  const seoInfo = { title, desc: title };

  return (
    <ReferendaLayout
      seoInfo={seoInfo}
      title={title}
      summaryData={gov2ReferendaSummary}
    >
      <ActiveReferendaProvider pallet="referenda">
        {isShowUnVotedOnly ? (
          <UnVotedOnlyList
            isShowUnVotedOnly={isShowUnVotedOnly}
            setIsShowUnVotedOnly={setIsShowUnVotedOnly}
          />
        ) : (
          <FullList
            isShowUnVotedOnly={isShowUnVotedOnly}
            setIsShowUnVotedOnly={setIsShowUnVotedOnly}
          />
        )}
      </ActiveReferendaProvider>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const {
    page = 1,
    page_size: pageSize = defaultPageSize,
    status: statusQuery = "",
  } = context.query;

  const status = upperFirst(camelCase(statusQuery));

  const [
    tracksProps,
    { result: posts },
    { result: gov2ReferendaSummary },
    { result: tracksDetail },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(gov2ReferendumsApi, {
      page,
      pageSize,
      status,
      simple: true,
    }),
    nextApi.fetch(gov2ReferendumsSummaryApi),
    nextApi.fetch(gov2TracksApi),
  ]);

  return {
    props: {
      tracksDetail: tracksDetail ?? null,
      posts: posts ?? EmptyList,
      title: "OpenGov Referenda",
      gov2ReferendaSummary: gov2ReferendaSummary ?? {},
      status,
      ...tracksProps,
    },
  };
});
