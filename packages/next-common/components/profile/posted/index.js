import { useEffect, useState, useMemo } from "react";
import { getProfileCategories } from "next-common/utils/consts/profile";
import { useRouter } from "next/router";
import { useChain } from "next-common/context/chain";
import List from "./list";
import Categories from "./categories";
import { usePageProps } from "next-common/context/page";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import CollectivesProvider from "next-common/context/collectives/collectives";

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
  const maybeEvmAddress = useMemo(() => tryConvertToEvmAddress(id), [id]);
  const postedRoute = route.replace(/^posted\//, "");

  const overview = useMemo(
    () => ({
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
    }),
    [summary],
  );

  const chain = useChain();
  const categories = useMemo(() => getProfileCategories(chain), [chain]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maybeEvmAddress, secondCategory.routePath]);

  useEffect(() => {
    const [, postedRoute] = router.asPath.split("/posted/");
    const items = getCategoryByRoute(postedRoute, categories);
    if (items[0] !== firstCategory || items[1] !== secondCategory) {
      setFirstCategory(items[0]);
      setSecondCategory(items[1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath, categories]);

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
          if (
            mainCategory !== firstCategory ||
            subCategory !== secondCategory
          ) {
            setFirstCategory(mainCategory);
            setSecondCategory(subCategory);
          }
          return;
        }
      }
    }
  }, [
    id,
    router.asPath,
    categories,
    overview,
    maybeEvmAddress,
    firstCategory,
    secondCategory,
  ]);

  if ("fellowship" === secondCategory.id) {
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
        <CollectivesProvider section="fellowship">
          <List
            key={secondCategory.categoryId}
            id={id}
            secondCategory={secondCategory}
          />
        </CollectivesProvider>
      </>
    );
  }

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
