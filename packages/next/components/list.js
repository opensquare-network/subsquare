import styled from "styled-components";

import Post from "./post";
import Tip from "./tip/tip";
import Pagination from "./pagination";
import EmptyList from "./emptyList";
import Motion from "./motion/motion";

const Wrapper = styled.div`
  @media screen and (max-width: 600px) {
    margin-left: 16px;
    margin-right: 16px;
  }

  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
`;

export default function List({
                               chain,
                               category,
                               items,
                               pagination,
                               type,
                               create = null,
                             }) {
  return (
    <Wrapper>
      <Title>
        {category}
        {create && create}
      </Title>
      {items?.length > 0 ? (
        items.map((item, index) => {
          if (category === "Referenda") {
            const href = `/${chain}/referenda/${item.index}`;
            return <Post
              key={index}
              data={item}
              chain={chain}
              href={href}
            />;
          }
          if (category === "On-chain Motions") {
            return <Motion key={index} data={item} chain={chain}/>;
          }
          if (category === "Tips") {
            return <Tip key={index} data={item} chain={chain}/>;
          }
          let href = `/${chain}/post/${item.postUid}`;
          if (category === "Proposals") {
            href = `/${chain}/proposal/${item.proposalIndex}`;
          }
          return <Post
            key={index}
            data={item}
            chain={chain}
            href={href}
          />;
        })
      ) : (
        <EmptyList type={category}/>
      )}
      {pagination && <Pagination {...pagination} />}
    </Wrapper>
  );
}
