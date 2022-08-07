import React, { Fragment } from "react";
import constructGroups from "./group";
import PageItem from "./item";
import styled from "styled-components";

const Ellipsis = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.textSecondary};
`;

export default function Items({ total = 0, page }) {
  let key = 0;
  const items = [];
  const groups = constructGroups(total, page - 1);
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    for (let j = 0; j < group.length; j++) {
      items.push(
        <PageItem now={ page } page={ group[j] } key={key++} />
      )
    }

    if (i < groups.length - 1) {
      items.push(<Ellipsis key={ key++ }>...</Ellipsis>)
    }
  }

  return <Fragment>
    {
      items
    }
  </Fragment>
}
