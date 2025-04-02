import React from "react";
import styled, { css } from "styled-components";
import { SecondaryCard } from "../../styled/containers/secondaryCard";
import { useChain } from "../../../context/chain";
import tw from "tailwind-styled-components";

const CategoryList = tw.ul`
  ps-0
  flex flex-wrap gap-2
  overflow-x-scroll overflow-y-hidden
  scrollbar-hidden
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
    <CategoryOption selected={selected} onClick={onClick} role="button">
      <Secondary selected={selected}>{type}</Secondary>
      <Tertiary>{count}</Tertiary>
    </CategoryOption>
  );
};

export default function Categories({
  categories,
  setFirstCategory,
  setSecondCategory,
  firstCategory,
  secondCategory,
  overview,
}) {
  const chain = useChain();

  const onFirstCategoryClick = (c) => {
    setFirstCategory(c);
    setSecondCategory(
      c.children.find((child) => !child?.excludeChains?.includes(chain)),
    );
  };

  const onSecondCategoryClick = (c) => {
    setSecondCategory(c);
  };

  return (
    <SecondaryCard>
      <div className="flex flex-col gap-4">
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
      </div>
    </SecondaryCard>
  );
}
