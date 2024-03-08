import React, { useEffect, useState } from "react";
import CommentList from "../../commentList";
import PostList from "../../postList";
import Flex from "../../styled/flex";
import Loading from "../../loading";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { useChain } from "next-common/context/chain";
import { pick } from "lodash-es";

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

  const list =
    secondCategory.id === "comments" ? (
      <CommentList
        items={data?.items ?? []}
        category={secondCategory.categoryName}
        pagination={pagination}
      />
    ) : (
      <PostList
        link={"/" + secondCategory.routePath}
        title={"List"}
        titleCount={data?.total}
        category={secondCategory.categoryId}
        items={data?.items ?? []}
        pagination={pagination}
      />
    );

  return (
    <Flex
      style={{
        marginTop: 28,
        flexBasis: "100%",
        justifyContent: "center",
      }}
    >
      {isLoading ? <Loading size={16} /> : list}
    </Flex>
  );
}
