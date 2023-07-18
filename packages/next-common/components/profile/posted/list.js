import React from "react";
import CommentList from "../../commentList";
import PostList from "../../postList";
import Flex from "../../styled/flex";
import Loading from "../../loading";

export default function List({ items, pagination, isLoading, secondCategory }) {
  const list =
    secondCategory.id === "comments" ? (
      <CommentList
        items={items}
        category={secondCategory.categoryName}
        pagination={pagination}
      />
    ) : (
      <PostList
        link={"/" + secondCategory.routePath}
        title={"List"}
        titleCount={pagination.total}
        category={secondCategory.categoryId}
        items={items}
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
