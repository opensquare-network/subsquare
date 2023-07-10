import React from "react";
import styled, { css } from "styled-components";
import { SecondaryCard } from "../styled/containers/secondaryCard";
import { no_scroll_bar } from "../../styles/componentCss";
import { useChain } from "../../context/chain";
import VStack from "../styled/vStack";

const CategoryWrapper = styled(SecondaryCard)``;

const CategoryList = styled.ul`
  all: unset;
  padding-inline-start: 0 !important;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  ${no_scroll_bar};
  flex-wrap: wrap;
  gap: 8px;
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
      background: var(--neutral200);
    `};
  cursor: pointer;
  user-select: none;
`;

const Secondary = styled.span`
  color: var(--textSecondary);
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;

  ${(props) =>
    props.selected &&
    css`
      font-weight: 700 !important;
      color: var(--textPrimary);
    `}
  :hover {
    color: var(--textPrimary);
  }
`;

const Tertiary = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--textTertiary);
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

export default function Categories({
  categories,
  setItems,
  setFirstCategory,
  setSecondCategory,
  resetPage,
  setIsLoading,
  firstCategory,
  secondCategory,
  overview,
}) {
  const chain = useChain();

  const onFirstCategoryClick = (c) => {
    setItems(null);
    setFirstCategory(c);
    setSecondCategory(
      c.children.find((child) => !child?.excludeChains?.includes(chain)),
    );
    resetPage();
  };

  const onSecondCategoryClick = (c) => {
    setIsLoading(true);
    setSecondCategory(c);
    resetPage();
  };

  return (
    <CategoryWrapper>
      <VStack space={16}>
        <CategoryList>
          {categories.map((c, index) => (
            <Category
              onClick={() => onFirstCategoryClick(c)}
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

            const count = getSecondCategoryCount(
              firstCategory.id,
              c.id,
              overview,
            );

            const selected = c.id === secondCategory.id;

            return (
              <Category
                onClick={() => onSecondCategoryClick(c)}
                key={index}
                type={c.name}
                count={count}
                selected={selected}
              />
            );
          })}
        </CategoryList>
      </VStack>
    </CategoryWrapper>
  );
}
