import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import ListLayout from "next-common/components/layout/ListLayout";
import PostList from "next-common/components/postList";
import businessCategory from "next-common/utils/consts/business/category";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import normalizeFellowshipApplicationListItem from "next-common/utils/viewfuncs/fellowshipApplication/normalizeFellowshipApplicationListItem";
import PrimaryButton from "next-common/lib/button/primary";
import { SystemPlus } from "@osn/icons/subsquare";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";

function NewFellowshipApplicationButton({ disabled }) {
  const router = useRouter();
  const { ensureConnect } = useEnsureLogin();

  const newApplication = useCallback(async () => {
    const connectedAccount = await ensureConnect();
    if (connectedAccount) {
      router.push("/fellowship/applications/create");
    }
  }, [router, ensureConnect]);

  return (
    <PrimaryButton
      size="small"
      disabled={disabled}
      iconLeft={<SystemPlus className="w-4 h-4" />}
      onClick={newApplication}
    >
      New Application
    </PrimaryButton>
  );
}

export default function FellowshipApplicationsPage({ posts }) {
  const title = "Fellowship Applications";
  const seoInfo = { title, desc: title };
  const items = (posts.items || []).map((item) =>
    normalizeFellowshipApplicationListItem(item),
  );

  return (
    <ListLayout
      seoInfo={seoInfo}
      title="Applications"
      description="Applications to join fellowship"
    >
      <PostList
        title="List"
        titleCount={posts.total}
        titleExtra={<NewFellowshipApplicationButton />}
        category={businessCategory.fellowshipApplications}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { page = 1, page_size: pageSize = 50 } = context.query;

  const tracksProps = await fetchOpenGovTracksProps();

  const { result: posts } = await nextApi.fetch("fellowship/applications", {
    page,
    pageSize,
  });

  return {
    props: {
      posts: posts ?? EmptyList,
      ...tracksProps,
    },
  };
});
