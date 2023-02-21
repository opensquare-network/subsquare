import React, { useEffect } from "react";
import { withLoginUserRedux } from "../../lib";
import { isAddress } from "../../utils/viewfuncs";
import { CATEGORIES } from "../../utils/consts/profile";
import nextApi from "next-common/services/nextApi";
import User from "../user";
import CommentList from "../commentList";
import PostList from "../postList";
import DetailLayout from "../layout/DetailLayout";
import Back from "../back";
import Avatar from "../avatar";
import Gravatar from "../gravatar";
import Flex from "../styled/flex";
import { AccountLinks } from "../links";
import Loading from "../loading";
import styled, { css } from "styled-components";
import { SecondaryCard } from "../styled/containers/secondaryCard";
import { no_scroll_bar } from "../../styles/componentCss";
import { useRouter } from "next/router";
import { useChain } from "../../context/chain";
import { pageHomeLayoutMainContentWidth } from "../../utils/constants";
import VStack from "../styled/vStack";

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

const BioWrapper = styled(SecondaryCard)`
  padding: 48px;
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
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  white-space: pre-wrap;
  word-break: break-all;
  color: ${(props) => props.theme.textTertiary};
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
`;

const CategoryOption = styled.li`
  all: unset;
  display: flex;
  align-items: center;
  gap: 4px;

  :first-child {
    font-weight: 500;
  }

  > span {
    height: 20px;
  }

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
      <Tertiary>{count}</Tertiary>
    </CategoryOption>
  );
};

const DisplayUser = ({ id }) => {
  if (isAddress(id)) {
    return <User add={id} showAvatar={false} fontSize={16} />;
  }

  return <Username>{id}</Username>;
};

const DisplayUserAddress = ({ address }) => {
  if (!address) {
    return null;
  }
  return (
    <AddressWrapper>
      <Tertiary>{address}</Tertiary>
      <AccountLinks address={address} />
    </AddressWrapper>
  );
};

const DisplayUserAvatar = ({ address, user }) => {
  return address ? (
    <Avatar address={address} size={48} />
  ) : (
    <Gravatar emailMd5={user?.emmailMd5} size={48} />
  );
};

const getCategoryByRoute = (route) => {
  let category;
  CATEGORIES.forEach((firstCategory) => {
    firstCategory.children.forEach((secondCategory) => {
      if (secondCategory.routePath === route) {
        category = [firstCategory, secondCategory];
      }
    });
  });
  if (category) {
    return category;
  }
  return [CATEGORIES[0], CATEGORIES[0].children[0]];
};

export default withLoginUserRedux(({ route, summary, user, id }) => {
  const chain = useChain();
  const defaultPage = { page: 1, pageSize: 10, total: 0 };
  const address = isAddress(id) ? id : user?.address;
  const [items, setItems] = React.useState([]);
  const [pagination, setPagination] = React.useState(defaultPage);
  const [isLoading, setIsLoading] = React.useState(true);
  const [firstCategory, setFirstCategory] = React.useState(
    getCategoryByRoute(route)[0]
  );
  const [secondCategory, setSecondCategory] = React.useState(
    getCategoryByRoute(route)[1]
  );
  const router = useRouter();

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

  const resetPage = () => setPagination({ ...pagination, page: 1 });

  useEffect(() => {
    setIsLoading(true);
    router.push(
      {
        pathname: `/user/${id}/${secondCategory.routePath}`,
      },
      undefined,
      { shallow: true }
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

  const list =
    secondCategory.id === "comments" ? (
      <CommentList
        items={items}
        category={secondCategory.categoryName}
        pagination={{ ...pagination, onPageChange }}
      />
    ) : (
      <PostList
        link={"/" + secondCategory.routePath}
        title={secondCategory.categoryName}
        category={secondCategory.categoryId}
        items={items}
        pagination={{ ...pagination, onPageChange }}
      />
    );

  return (
    <DetailLayout>
      <Back href={`/`} text="Profile" />
      <Wrapper>
        <BioWrapper>
          <DisplayUserAvatar address={address} user={user} />
          <Flex style={{ marginTop: 0, flexWrap: "wrap" }}>
            <DisplayUser id={id} />
            <DisplayUserAddress address={address} />
          </Flex>
        </BioWrapper>
        <CategoryWrapper>
          <VStack space={16}>
            <CategoryList>
              {CATEGORIES.map((c, index) => (
                <Category
                  onClick={() => {
                    setItems(null);
                    setFirstCategory(c);
                    setSecondCategory(
                      c.children.find(
                        (child) => !child?.excludeChains?.includes(chain)
                      )
                    );
                    resetPage();
                  }}
                  key={index}
                  type={c.name}
                  count={getFirstCategoryCount(c.id, overview)}
                  selected={c.id === firstCategory.id}
                />
              ))}
            </CategoryList>
            <CategoryList>
              {firstCategory.children.map((c, index) => {
                if (c?.excludeChains?.includes(chain)) {
                  return null;
                }
                return (
                  <Category
                    onClick={() => {
                      setIsLoading(true);
                      setSecondCategory(c);
                      resetPage();
                    }}
                    key={index}
                    type={c.name}
                    count={getSecondCategoryCount(
                      firstCategory.id,
                      c.id,
                      overview
                    )}
                    selected={c.id === secondCategory.id}
                  />
                );
              })}
            </CategoryList>
          </VStack>
        </CategoryWrapper>
      </Wrapper>

      {isLoading ? (
        <Flex
          style={{
            marginTop: 28,
            flexBasis: "100%",
            justifyContent: "center",
          }}
        >
          <Loading size={16} />
        </Flex>
      ) : (
        list
      )}
    </DetailLayout>
  );
});
