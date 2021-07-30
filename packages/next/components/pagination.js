import styled, { css } from "styled-components";
import { useState } from "react";

const Wrapper = styled.div`
  padding-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const Nav = styled.div`
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  > img {
    filter: invert(37%) sepia(45%) saturate(261%) hue-rotate(173deg)
      brightness(89%) contrast(90%);
  }
  :hover {
    background: #ebeef4;
  }
  ${(p) =>
    p.disabled &&
    css`
      cursor: auto;
      > img {
        filter: invert(82%) sepia(19%) saturate(265%) hue-rotate(177deg)
          brightness(81%) contrast(83%);
      }
      :hover {
        background: none;
      }
    `}
`;

const Item = styled.a`
  padding: 0 8px;
  cursor: pointer;
  min-width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: #506176;
  :hover {
    background: #ebeef4;
  }
  ${(p) =>
    p.active &&
    css`
      background: #ebeef4;
      color: #1e2134;
      cursor: auto;
    `}
`;

const Ellipsis = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #506176;
  & + & {
    display: none;
  }
`;

export default function Pagination() {
  const total = 9;
  const [page, setPage] = useState(1);

  return (
    <Wrapper>
      <Nav
        disabled={page === 1}
        onClick={() => {
          if (page > 1) {
            setPage(page - 1);
          }
        }}
      >
        <img src="/imgs/icons/caret-left.svg" />
      </Nav>
      {Array.from(Array(total)).map((_, index) =>
        index + 1 > 2 &&
        index + 1 < total - 1 &&
        Math.abs(index + 1 - page) >= 2 ? (
          <Ellipsis key={index}>...</Ellipsis>
        ) : (
          <Item
            key={index}
            onClick={() => {
              if (index + 1 === page) return;
              setPage(index + 1);
            }}
            active={index + 1 === page}
          >
            {index + 1}
          </Item>
        )
      )}
      <Nav
        disabled={page === total}
        onClick={() => {
          if (page < total) {
            setPage(page + 1);
          }
        }}
      >
        <img src="/imgs/icons/caret-right.svg" />
      </Nav>
    </Wrapper>
  );
}
