import React, { useEffect, useState } from "react";
import CommentList from "../../commentList";
import PostList from "../../postList";
import Flex from "../../styled/flex";
import Loading from "../../loading";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { useChain } from "next-common/context/chain";
import { pick } from "lodash-es";
import FellowshipReferendaPostList from "next-common/components/postList/fellowshipReferendaPostList";
import businessCategory from "next-common/utils/consts/business/category";
import TreasuryBountiesPostList from "next-common/components/postList/treasyrybountiesPostList";
import TreasuryTipsPostList from "next-common/components/postList/treasuryTipsPostList";
import TreasuryProposalsPostList from "next-common/components/postList/treasuryProposalsPostList";
import ReferendaPostList from "next-common/components/postList/referendaPostList";
import DemocracyReferendaPostList from "next-common/components/postList/democracyReferendaPostList";
import DemocracyExternalProposalsPostList from "next-common/components/postList/democracyExternalProposalsPostList";
import DemocracyPublicProposalsPostList from "next-common/components/postList/democracyPublicProposalsPostList";
import CouncilMotionsPostList from "next-common/components/postList/councilMotionsPostList";
import TechCommProposalsPostList from "next-common/components/postList/techCommProposalsPostList";
import DiscussionPostList from "next-common/components/postList/discussionPostList";
import PolkassemblyDiscussionPostList from "next-common/components/postList/polkassemblyDiscussionPostList";

const InnerList = ({ secondCategory, data, pagination }) => {
  const link = "/" + secondCategory.routePath;
  const titleCount = data?.total;
  const items = data?.items ?? [];

  if (secondCategory.id === "comments") {
    return <CommentList items={items} pagination={pagination} />;
  }

  if (secondCategory.categoryId === businessCategory.fellowship) {
    return (
      <FellowshipReferendaPostList
        title={secondCategory.categoryName}
        titleCount={titleCount}
        items={items}
        pagination={pagination}
      />
    );
  }

  if (secondCategory.categoryId === businessCategory.treasuryBounties) {
    return (
      <TreasuryBountiesPostList
        title={secondCategory.categoryName}
        titleCount={titleCount}
        items={items}
        pagination={pagination}
      />
    );
  }

  if (secondCategory.categoryId === businessCategory.treasuryTips) {
    return (
      <TreasuryTipsPostList
        title={secondCategory.categoryName}
        titleCount={titleCount}
        items={items}
        pagination={pagination}
      />
    );
  }

  if (secondCategory.categoryId === businessCategory.treasuryProposals) {
    return (
      <TreasuryProposalsPostList
        title={secondCategory.categoryName}
        titleCount={titleCount}
        items={items}
        pagination={pagination}
      />
    );
  }

  if (secondCategory.categoryId === businessCategory.openGovReferenda) {
    return (
      <ReferendaPostList
        title={secondCategory.categoryName}
        titleCount={titleCount}
        items={items}
        pagination={pagination}
        link={link}
      />
    );
  }

  if (secondCategory.categoryId === businessCategory.democracyReferenda) {
    return (
      <DemocracyReferendaPostList
        title={secondCategory.categoryName}
        titleCount={titleCount}
        items={items}
        pagination={pagination}
        link={link}
      />
    );
  }

  if (secondCategory.categoryId === businessCategory.democracyProposals) {
    return (
      <DemocracyPublicProposalsPostList
        title={secondCategory.categoryName}
        titleCount={titleCount}
        items={items}
        pagination={pagination}
        link={link}
      />
    );
  }

  if (secondCategory.categoryId === businessCategory.democracyExternals) {
    return (
      <DemocracyExternalProposalsPostList
        title={secondCategory.categoryName}
        titleCount={titleCount}
        items={items}
        pagination={pagination}
        link={link}
      />
    );
  }

  if (secondCategory.categoryId === businessCategory.councilMotions) {
    return (
      <CouncilMotionsPostList
        title={secondCategory.categoryName}
        titleCount={titleCount}
        items={items}
        pagination={pagination}
        link={link}
      />
    );
  }

  if (secondCategory.categoryId === businessCategory.tcProposals) {
    return (
      <TechCommProposalsPostList
        title={secondCategory.categoryName}
        titleCount={titleCount}
        items={items}
        pagination={pagination}
        link={link}
      />
    );
  }
  if (secondCategory.categoryId === businessCategory.discussions) {
    return (
      <DiscussionPostList
        title={secondCategory.categoryName}
        titleCount={titleCount}
        items={items}
        pagination={pagination}
      />
    );
  }
  if (secondCategory.categoryId === businessCategory.polkassemblyDiscussions) {
    return (
      <PolkassemblyDiscussionPostList
        title={secondCategory.categoryName}
        titleCount={titleCount}
        items={items}
        pagination={pagination}
      />
    );
  }

  return (
    <PostList
      title={secondCategory.categoryName}
      link={link}
      titleCount={titleCount}
      category={secondCategory.categoryName}
      items={items}
      pagination={pagination}
    />
  );
};

export default function List({ id, secondCategory }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(EmptyList);
  const [isLoading, setIsLoading] = useState(true);
  const chain = useChain();

  useEffect(() => {
    let cancel = false;

    setIsLoading(true);
    nextApi
      .fetch(`users/${id}/${secondCategory.apiPath}`, {
        page,
        pageSize: 10,
      })
      .then(({ result: { items, page, pageSize, total } }) => {
        if (cancel) {
          return;
        }

        setData({
          items: items.map((item) => secondCategory.formatter(chain, item)),
          page,
          pageSize,
          total,
        });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      cancel = true;
    };
  }, [chain, id, page, secondCategory]);

  const onPageChange = (e, target) => {
    e.preventDefault();
    setPage(target);
  };

  const pagination = {
    ...pick(data, ["page", "pageSize", "total"]),
    onPageChange,
  };

  return (
    <Flex
      style={{
        marginTop: 28,
        flexBasis: "100%",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <Loading size={16} />
      ) : (
        <InnerList
          secondCategory={secondCategory}
          data={data}
          pagination={pagination}
        />
      )}
    </Flex>
  );
}
