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
import Grvatar from "../gravatar";
import Flex from "../styled/flex";
import Links from "../links";
import Loading from "../loading";
import styled, { css } from "styled-components";
import { SecondaryCard } from "../styled/containers/secondaryCard";
import { no_scroll_bar } from "../../styles/componentCss";
import { useRouter } from "next/router";

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
      <Tertiary>{count}</Tertiary>
    </CategoryOption>
  );
};

const DisplayUser = ({ id, chain }) => {
  if (isAddress(id)) {
    return <User chain={chain} add={id} showAvatar={false} fontSize={16} />;
  }

  return <Username>{id}</Username>;
};

const DisplayUserAddress = ({ address, chain }) => {
  if (!address) {
    return null;
  }
  return (
    <AddressWrapper>
      <Tertiary>{address}</Tertiary>
      <Links chain={chain} address={address} />
    </AddressWrapper>
  );
};

const DisplayUserAvatar = ({ address, user }) => {
  return address ? (
    <Avatar address={address} size={48} />
  ) : (
    <Grvatar emailMd5={user?.emmailMd5} size={48} />
  );
};

export default withLoginUserRedux(({ loginUser, summary, user, chain, id }) => {
  const router = useRouter();
  const defaultPage = { page: 1, pageSize: 10, total: 0 };
  const address = isAddress(id) ? id : user?.addresses?.[0]?.address;
  const [items, setItems] = React.useState([]);
  const [pagination, setPagination] = React.useState(defaultPage);
  const [isLoading, setIsLoading] = React.useState(false);
  const [firstCategory, setFirstCategory] = React.useState(CATEGORIES[0]);
  const [secondCategory, setSecondCategory] = React.useState(
    CATEGORIES[0].children[0]
  );
  const overview = {
    ...summary,
    collectives: {
      councilMotions: summary?.council?.motions ?? 0,
      techCommProposals: summary?.techComm?.proposals ?? 0,
    },
  };

  useEffect(() => {
    setPagination({ ...pagination, page: parseInt(router?.query?.page ?? 1) });
  }, [router?.query?.page]);

  useEffect(() => {
    setIsLoading(true);
    nextApi
      .fetch(`users/${id}/${secondCategory.routePath}`, {
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
  }, [chain, id, pagination.pageSize, secondCategory]);

  const list =
    secondCategory.id === "comments" ? (
      <CommentList
        items={items}
        chain={chain}
        category={secondCategory.categoryName}
        pagination={pagination}
      />
    ) : (
      <PostList
        chain={chain}
        title={secondCategory.categoryName}
        category={secondCategory.categoryId}
        items={items}
        pagination={pagination}
      />
    );

  return (
    <DetailLayout user={loginUser} chain={chain}>
      <Back href={`/`} text="Profile" />
      <Wrapper>
        <BioWrapper>
          <DisplayUserAvatar address={address} user={user} />
          <Flex style={{ marginTop: 0, flexWrap: "wrap" }}>
            <DisplayUser id={id} chain={chain} />
            <DisplayUserAddress address={address} chain={chain} />
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
                count={getFirstCategoryCount(c.id, overview)}
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
                count={getSecondCategoryCount(firstCategory.id, c.id, overview)}
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
