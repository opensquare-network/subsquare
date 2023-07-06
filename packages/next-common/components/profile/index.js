import React, { useEffect, useState } from "react";
import ListLayout from "next-common/components/layout/ListLayout";
import nextApi from "next-common/services/nextApi";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { withLoginUserRedux } from "../../lib";
import { isPolkadotAddress } from "../../utils/viewfuncs";
import { getProfileCategories } from "../../utils/consts/profile";
import { useRouter } from "next/router";
import { useChain } from "../../context/chain";
import Bio from "./bio";
import List from "./list";
import Categories from "./categories";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { addressEllipsis } from "next-common/utils";
import isMoonChain from "next-common/utils/isMoonChain";

const getCategoryByRoute = (route, categories = []) => {
  let category;
  categories.forEach((firstCategory) => {
    firstCategory.children.forEach((secondCategory) => {
      if (secondCategory.routePath === route) {
        category = [firstCategory, secondCategory];
      }
    });
  });
  if (category) {
    return category;
  }
  return [categories[0], categories[0].children[0]];
};

export default withLoginUserRedux(({ route, summary, user, id }) => {
  const overview = {
    ...summary,
    collectives: {
      councilMotions: summary?.council?.motions ?? 0,
      techCommProposals: summary?.techComm?.proposals ?? 0,
    },
    discussions: {
      posts: summary?.discussions ?? 0,
      comments: summary?.comments ?? 0,
      polkassemblyDiscussions: summary?.polkassemblyDiscussions ?? 0,
    },
  };

  if (isMoonChain()) {
    overview.collectives.treasuryCouncilMotions =
      overview.collectives.councilMotions ?? 0;
    overview.collectives.councilMotions = summary?.moonCouncil?.motions ?? 0;
    overview.collectives.openTechCommProposals =
      summary?.openTechComm?.proposals ?? 0;
  }

  const chain = useChain();
  const defaultPage = { page: 1, pageSize: 10, total: 0 };
  const address =
    isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(defaultPage);
  const [isLoading, setIsLoading] = useState(true);
  const categories = getProfileCategories(chain);
  const [firstCategory, setFirstCategory] = useState(
    getCategoryByRoute(route, categories)[0],
  );
  const [secondCategory, setSecondCategory] = useState(
    getCategoryByRoute(route, categories)[1],
  );
  const router = useRouter();

  const resetPage = () => setPagination({ ...pagination, page: 1 });

  useEffect(() => {
    setIsLoading(true);
    router.push(
      {
        pathname: `/user/${id}/${secondCategory.routePath}`,
      },
      undefined,
      { shallow: true },
    );
    nextApi
      .fetch(`users/${id}/${secondCategory.apiPath}`, {
        page: pagination.page,
        pageSize: pagination.pageSize,
      })
      .then(({ result: { items, page, pageSize, total } }) => {
        setItems(items.map((item) => secondCategory.formatter(chain, item)));
        setPagination({ page, pageSize, total });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [chain, id, pagination.page, pagination.pageSize, secondCategory]);

  const onPageChange = (e, target) => {
    e.preventDefault();
    setPagination({ ...pagination, page: target });
  };

  const breadcrumbItems = [
    {
      content: "Profile",
    },
    {
      content: addressEllipsis(id),
    },
  ];

  useEffect(() => {
    if (router.asPath !== `/user/${id}`) {
      return;
    }

    let mainCategory, subCategory;

    // find first non-empty category
    for (mainCategory of categories) {
      if (!overview[mainCategory.id]) {
        continue;
      }
      for (subCategory of mainCategory.children) {
        if (overview[mainCategory.id][subCategory.id] > 0) {
          setFirstCategory(mainCategory);
          setSecondCategory(subCategory);
          return;
        }
      }
    }
  }, [id, router, categories, summary]);

  return (
    <ListLayout
      header={
        <>
          <BreadcrumbWrapper>
            <Breadcrumb items={breadcrumbItems} />
          </BreadcrumbWrapper>
          <Bio address={address} user={user} id={id} />
        </>
      }
      tabs={[
        {
          label: "Posted",
          url: `/user/${id}`,
        },
      ]}
    >
      <Categories
        categories={categories}
        setItems={setItems}
        setFirstCategory={setFirstCategory}
        setSecondCategory={setSecondCategory}
        resetPage={resetPage}
        setIsLoading={setIsLoading}
        firstCategory={firstCategory}
        secondCategory={secondCategory}
        overview={overview}
      />
      <List
        items={items}
        pagination={{ ...pagination, onPageChange }}
        isLoading={isLoading}
        secondCategory={secondCategory}
      />
    </ListLayout>
  );
});
