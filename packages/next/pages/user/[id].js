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
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { isAddress } from "next-common/utils/viewfuncs";
import Grvatar from "next-common/components/gravatar";
import CommentList from "next-common/components/commentList";
import { no_scroll_bar } from "next-common/styles/componentCss";
import Loading from "next-common/components/loading";
import { CATEGORIES } from "next-common/utils/consts/profile";

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
  :hover {
    color: ${(props) => props.theme.textPrimary};
  }
`;

const Tertiary = styled.span`
  color: ${(props) => props.theme.textTertiary};
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  white-space: pre-wrap;
  word-break: break-all;
`;

const CategoryWrapper = styled(SecondaryCard)``;

const CategoryList = styled.ul`
  all: unset;
  padding-inline-start: 0 !important;
  display: flex;
  height: 28px;
  gap: 16px;
  overflow-x: scroll;
  overflow-y: hidden;
  ${no_scroll_bar};

  li {
    display: flex;
    gap: 4px;

    :first-child {
      font-weight: 500;
    }
    > span {
      height: 20px;
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

const Username = styled.span`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.textPrimary};
`;

const AddressWrapper = styled(Flex)`
  gap: 8px;
  margin-top: 4px;
  flex-basis: 100%;
  flex-wrap: wrap;
`;

const getFirstCategoryCount = (firstCategory, summary) => {
  if (!summary[firstCategory]) {
    return 0;
  }
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
  if (!summary[firstCategory]) {
    return 0;
  }
  if (Number.isInteger(summary[firstCategory])) {
    return summary[firstCategory];
  }
  return summary[firstCategory][secondCategory] ?? 0;
};

const Category = ({ type, count, selected, onClick }) => {
  return (
    <CategoryOption selected={selected} onClick={onClick}>
      <Secondary selected={selected}>{type}</Secondary>
      {count && <Tertiary>{count}</Tertiary>}
    </CategoryOption>
  );
};

export default withLoginUserRedux(({ loginUser, summary, user, chain, id }) => {
  const defaultPage = { page: 1, pageSize: 10, total: 0 };
  const address = isAddress(id) ? id : user?.addresses?.[0]?.address;
  const [items, setItems] = React.useState([]);
  const [pagination, setPagination] = React.useState(defaultPage);
  const [isLoading, setIsLoading] = React.useState(false);
  const [firstCategory, setFirstCategory] = React.useState(CATEGORIES[0]);
  const [secondCategory, setSecondCategory] = React.useState(
    CATEGORIES[0].children[0]
  );

  useEffect(() => {
    setIsLoading(true);
    nextApi
      .fetch(`users/${id}/${secondCategory.routePath}`, {
        page: pagination.page,
        pageSize: pagination.pageSize,
      })
      .then(({ result: { items, pageSize, total } }) => {
        setItems(items.map((item) => secondCategory.formatter(chain, item)));
        setPagination({ page: 1, pageSize, total });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [chain, id, pagination.page, pagination.pageSize, secondCategory]);

  const username = isAddress(id) ? (
    <User chain={chain} add={id} showAvatar={false} fontSize={16} />
  ) : (
    <Username>{id}</Username>
  );

  const list =
    secondCategory.id === "comments" ? (
      <CommentList
        items={items}
        chain={chain}
        category={"Comments"}
        pagination={pagination}
      />
    ) : (
      <PostList
        chain={chain}
        category={`${firstCategory.name} ${secondCategory.name}`}
        items={items}
        pagination={pagination}
      />
    );

  return (
    <DetailLayout user={loginUser} chain={chain}>
      <Back href={`/`} text="Profile" />
      <Wrapper>
        <BioWrapper>
          {address ? (
            <Avatar address={address} size={48} />
          ) : (
            <Grvatar emailMd5={user?.emmailMd5} size={48} />
          )}
          <Flex style={{ marginTop: 0, flexWrap: "wrap" }}>
            {username}
            {address && (
              <AddressWrapper>
                <Tertiary>{address}</Tertiary>
                <Links chain={chain} address={address} />
              </AddressWrapper>
            )}
          </Flex>
        </BioWrapper>
        <CategoryWrapper>
          <CategoryList>
            {CATEGORIES.map((c, index) => (
              <Category
                onClick={() => {
                  setItems(null);
                  setFirstCategory(c);
                  setSecondCategory(c.children[0]);
                }}
                key={index}
                type={c.name}
                count={getFirstCategoryCount(c.id, summary)}
                selected={c.id === firstCategory.id}
              />
            ))}
          </CategoryList>
          <CategoryList>
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
          </CategoryList>
        </CategoryWrapper>
      </Wrapper>

      {isLoading ? (
        <Flex style={{ flexBasis: "100%", justifyContent: "center" }}>
          <Loading size={40} />
        </Flex>
      ) : (
        list
      )}
    </DetailLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id } = context.query;

  const [{ result: summary }, { result: user }] = await Promise.all([
    nextApi.fetch(`users/${id}/counts`),
    nextApi.fetch(`users/${id}`),
  ]);

  return {
    props: {
      id,
      chain,
      summary,
      user,
    },
  };
});
