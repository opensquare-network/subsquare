import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ListLayout from "next-common/components/layout/ListLayout";
import nextApi from "next-common/services/nextApi";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { withLoginUserRedux } from "../../lib";
import { isPolkadotAddress } from "../../utils/viewfuncs";
import { getProfileCategories } from "../../utils/consts/profile";
import Back from "../back";
import { useRouter } from "next/router";
import { useChain } from "../../context/chain";
import { pageHomeLayoutMainContentWidth } from "../../utils/constants";
import Bio from "./bio";
import List from "./list";
import Categories from "./categories";

const Wrapper = styled.div`
  max-width: ${pageHomeLayoutMainContentWidth}px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;

  > :not(:first-child) {
    margin-top: 16px;
  }

  @media screen and (max-width: 768px) {
    margin-left: 16px;
    margin-right: 16px;
  }
`;

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

  return (
    <ListLayout
      header={
        <>
          <Back href={"/"} text="Profile" />
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
        summary={summary}
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
