import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import DetailLayout from "next-common/components/layout/DetailLayout";
import Back from "next-common/components/back";
import styled, { css } from "styled-components";
import Avatar from "next-common/components/avatar";
import Links from "next-common/components/links";
import User from "next-common/components/user";
import Flex from "next-common/components/styled/flex";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import List from "next-common/components/list";
import React from "react";
import { toDiscussionListItem } from "../../utils/viewfuncs";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

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

export default withLoginUserRedux(
  ({ loginUser, discussions, summary, chain, id }) => {
    const categories = [
      {
        id: "treasury",
        name: "Treasury",
        children: [
          { id: "proposals", name: "Proposed Proposals" },
          { id: "tips", name: "Proposed Tips" },
        ],
      },
      {
        id: "democracy",
        name: "Democracy",
        children: [{ id: "proposals", name: "Proposals" }],
      },
      {
        id: "discussions",
        name: "Discussions",
        children: [{ id: "discussions", name: "Discussions" }],
      },
      {
        id: "comments",
        name: "Comments",
        children: [{ id: "comments", name: "Comments" }],
      },
    ];

    const [items, setItems] = React.useState(
      (discussions.items || []).map((item) => toDiscussionListItem(chain, item))
    );
    const [firstCategory, setFirstCategory] = React.useState(categories[0]);
    const [secondCategory, setSecondCategory] = React.useState(
      categories[0].children[0]
    );

    return (
      <DetailLayout user={loginUser} chain={chain}>
        <Back href={` / `} text="Profile" />
        <Wrapper>
          <BioWrapper>
            <Avatar address={id} size={48} />
            <div>
              <User chain={chain} add={id} showAvatar={false} fontSize={16} />
              <Flex style={{ gap: 8, marginTop: 4 }}>
                <Tertiary>{id}</Tertiary>
                <Links chain={chain} address={id} />
              </Flex>
            </div>
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
                  count={getSecondCategoryCount(
                    firstCategory.id,
                    c.id,
                    summary
                  )}
                  selected={c.id === secondCategory.id}
                />
              ))}
            </ul>
          </CategoryWrapper>
        </Wrapper>

        <List
          chain={chain}
          category={`${firstCategory.name} ${secondCategory.name}`}
          items={items}
          pagination={{
            page: discussions.page,
            pageSize: discussions.pageSize,
            total: discussions.total,
          }}
        />
      </DetailLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id } = context.query;

  //fixme: this is mock

  const [{ result: discussions }, { result: summary }] = await Promise.all([
    nextApi.fetch("posts", { page: 1, pageSize: 3 }),
    nextApi.fetch(`users/${id}/counts`),
  ]);

  return {
    props: {
      id,
      chain,
      discussions,
      summary,
    },
  };
});
