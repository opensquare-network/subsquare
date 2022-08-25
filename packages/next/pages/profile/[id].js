import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import DetailLayout from "next-common/components/layout/DetailLayout";
import Back from "next-common/components/back";
import styled, { css } from "styled-components";
import Avatar from "next-common/components/avatar";
import Links from "next-common/components/links";
import User from "next-common/components/user";
import Flex from "next-common/components/styled/flex";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import PostList from "next-common/components/postList";
import React, { useEffect } from "react";
import {
  toDiscussionListItem,
  toTreasuryProposalListItem,
} from "../../utils/viewfuncs";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { isAddress } from "next-common/utils/viewfuncs";
import Grvatar from "next-common/components/gravatar";
import CommentList from "next-common/components/commentList";

const Wrapper = styled.div`
  max-width: 932px;
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

const BioWrapper = styled(SecondaryCard)`
  margin-top: 0;
  display: flex;
  gap: 16px;
`;

const Secondary = styled.span`
  color: ${(props) => props.theme.textSecondary};
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  ${(props) =>
    props.selected &&
    css`
      font-weight: 700 !important;
      color: ${(props) => props.theme.textPrimary};
    `}
`;

const Tertiary = styled.span`
  color: ${(props) => props.theme.textTertiary};
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

const CategoryWrapper = styled(SecondaryCard)`
  ul {
    all: unset;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    li {
      display: flex;
      gap: 4px;

      :first-child {
        font-weight: 500;
      }
    }
  }
`;

const CategoryOption = styled.li`
  all: unset;
  padding: 4px 8px;
  border-radius: 4px;
  ${(props) =>
    props.selected &&
    css`
      background: ${props.theme.grey100Bg};
    `};
  cursor: pointer;
  user-select: none;
`;

const getFirstCategoryCount = (firstCategory, summary) => {
  if (firstCategory === "comments" || firstCategory === "discussions") {
    return summary[firstCategory];
  }
  return Object.keys(summary[firstCategory])
    .map((secondCategory) => {
      return summary[firstCategory][secondCategory];
    })
    .reduce((partialSum, a) => partialSum + a, 0);
};

const getSecondCategoryCount = (firstCategory, secondCategory, summary) => {
  return summary[firstCategory][secondCategory];
};

const Category = ({ type, count, selected, onClick }) => {
  return (
    <CategoryOption selected={selected} onClick={onClick}>
      <Secondary selected={selected}>{type}</Secondary>
      {count && <Tertiary>{count}</Tertiary>}
    </CategoryOption>
  );
};

const categories = [
  {
    id: "treasury",
    name: "Treasury",
    children: [
      {
        id: "proposals",
        name: "Proposed Proposals",
        routePath: "treasury-proposals",
      },
      { id: "tips", name: "Proposed Tips", routePath: "tips" },
    ],
  },
  {
    id: "democracy",
    name: "Democracy",
    children: [
      { id: "proposals", name: "Proposals", routePath: "public-proposals" },
    ],
  },
  {
    id: "discussions",
    name: "Discussions",
    children: [{ id: "discussions", name: "Discussions", routePath: "posts" }],
  },
  {
    id: "comments",
    name: "Comments",
    children: [{ id: "comments", name: "Comments", routePath: "comments" }],
  },
];

export default withLoginUserRedux(({ loginUser, summary, chain, id }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [items, setItems] = React.useState([]);
  const [firstCategory, setFirstCategory] = React.useState(categories[0]);
  const [secondCategory, setSecondCategory] = React.useState(
    categories[0].children[0]
  );

  useEffect(() => {
    try {
      setIsLoading(true);
      nextApi
        .fetch(`users/${id}/${secondCategory.routePath}`)
        .then(({ result: { items, pageSize, total } }) => {
          // console.log(res);
          if (secondCategory.id === "comments") {
            setItems(items);
          } else {
            setItems(
              items.map((item) => toTreasuryProposalListItem(chain, item))
            );
          }
          setPagination({ page: 1, pageSize, total });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (e) {
    } finally {
    }
  }, [chain, id, secondCategory]);

  const username = isAddress(id) ? (
    <User chain={chain} add={id} showAvatar={false} fontSize={16} />
  ) : (
    <span>{id}</span>
  );

  return (
    <DetailLayout user={loginUser} chain={chain}>
      <Back href={`/`} text="Profile" />
      <Wrapper>
        <BioWrapper>
          {isAddress(id) ? (
            <Avatar address={id} size={48} />
          ) : (
            //fixme: make this email
            <Grvatar email={id} emailMd5={id} size={48} />
          )}

          <Flex style={{ marginTop: 0, flexWrap: "wrap" }}>
            {username}
            {isAddress(id) && (
              <Flex style={{ gap: 8, marginTop: 4, flexBasis: "100%" }}>
                <Tertiary>{id}</Tertiary>
                <Links chain={chain} address={id} />
              </Flex>
            )}
          </Flex>
        </BioWrapper>
        <CategoryWrapper>
          <ul>
            {categories.map((c, index) => (
              <Category
                onClick={() => {
                  setFirstCategory(c);
                  setSecondCategory(c.children[0]);
                }}
                key={index}
                type={c.name}
                count={getFirstCategoryCount(c.id, summary)}
                selected={c.id === firstCategory.id}
              />
            ))}
          </ul>
          <ul>
            {firstCategory.children.map((c, index) => (
              <Category
                onClick={() => {
                  setSecondCategory(c);
                }}
                key={index}
                type={c.name}
                count={getSecondCategoryCount(firstCategory.id, c.id, summary)}
                selected={c.id === secondCategory.id}
              />
            ))}
          </ul>
        </CategoryWrapper>
      </Wrapper>

      {isLoading ? (
        <h1>Loading</h1>
      ) : firstCategory.id === "comments" ? (
        <CommentList
          items={items}
          chain={chain}
          category={"cate"}
          pagination={pagination}
        />
      ) : (
        <PostList
          chain={chain}
          category={`${firstCategory.name} ${secondCategory.name}`}
          items={items}
          pagination={pagination}
        />
      )}
    </DetailLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id } = context.query;

  const [{ result: summary }] = await Promise.all([
    nextApi.fetch(`users/${id}/counts`),
  ]);

  return {
    props: {
      id,
      chain,
      summary,
    },
  };
});
