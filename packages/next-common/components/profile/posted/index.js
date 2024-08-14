import { useEffect, useState } from "react";
import { getProfileCategories } from "../../../utils/consts/profile";
import { useRouter } from "next/router";
import { useChain } from "../../../context/chain";
import List from "./list";
import Categories from "./categories";
import { usePageProps } from "next-common/context/page";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";

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
  const { route, userSummary: summary, id } = usePageProps();
  const maybeEvmAddress = tryConvertToEvmAddress(id);
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

  const chain = useChain();
  const categories = getProfileCategories(chain);
  const [firstCategory, setFirstCategory] = useState(
    getCategoryByRoute(postedRoute, categories)[0],
  );
  const [secondCategory, setSecondCategory] = useState(
    getCategoryByRoute(postedRoute, categories)[1],
  );
  const router = useRouter();

  useEffect(() => {
    router.push(
      {
        pathname: `/user/${maybeEvmAddress}/posted/${secondCategory.routePath}`,
      },
      undefined,
      { shallow: true },
    );
  }, [maybeEvmAddress, secondCategory]);

  useEffect(() => {
    const [, postedRoute] = router.asPath.split("/posted/");
    const items = getCategoryByRoute(postedRoute, categories);
    setFirstCategory(items[0]);
    setSecondCategory(items[1]);
  }, [router]);

  useEffect(() => {
    if (router.asPath !== `/user/${maybeEvmAddress}`) {
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
        setFirstCategory={setFirstCategory}
        setSecondCategory={setSecondCategory}
        firstCategory={firstCategory}
        secondCategory={secondCategory}
        overview={overview}
      />
      <List
        key={secondCategory.categoryId}
        id={id}
        secondCategory={secondCategory}
      />
    </>
  );
}
