import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { getProfileCategories } from "../../../utils/consts/profile";
import { useRouter } from "next/router";
import { useChain } from "../../../context/chain";
import List from "./list";
import Categories from "./categories";
import isMoonChain from "next-common/utils/isMoonChain";
import { usePageProps } from "next-common/context/page";

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

export default function Posted() {
  const { route, summary, id } = usePageProps();
  const postedRoute = route.replace(/^posted\//, "");

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
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(defaultPage);
  const [isLoading, setIsLoading] = useState(true);
  const categories = getProfileCategories(chain);
  const [firstCategory, setFirstCategory] = useState(
    getCategoryByRoute(postedRoute, categories)[0],
  );
  const [secondCategory, setSecondCategory] = useState(
    getCategoryByRoute(postedRoute, categories)[1],
  );
  const router = useRouter();

  const resetPage = () => setPagination({ ...pagination, page: 1 });

  useEffect(() => {
    let cancel = false;

    setIsLoading(true);
    router.push(
      {
        pathname: `/user/${id}/posted/${secondCategory.routePath}`,
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
        if (cancel) {
          return;
        }

        setItems(items.map((item) => secondCategory.formatter(chain, item)));
        setPagination({ page, pageSize, total });
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
  }, [chain, id, pagination.page, pagination.pageSize, secondCategory]);

  const onPageChange = (e, target) => {
    e.preventDefault();
    setPagination({ ...pagination, page: target });
  };

  useEffect(() => {
    const [, postedRoute] = router.asPath.split("/posted/");
    const items = getCategoryByRoute(postedRoute, categories);
    setFirstCategory(items[0]);
    setSecondCategory(items[1]);
  }, [router]);

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
    <>
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
    </>
  );
}
