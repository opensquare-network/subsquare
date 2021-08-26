import styled from "styled-components";

import Post from "./post";
import Pagination from "./pagination";
import EmptyList from "./emptyList";

const Wrapper = styled.div`
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
`;

const PostWrapper = styled.div`
  margin-top: 16px;
  > :not(:first-child) {
    margin-top: 16px;
  }

  max-height: calc(100vh - 268px);
  @media screen and (max-width: 600px) {
    max-height: calc(100vh - 178px);
  }
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`


export default function List({ chain, category, items, pagination , create=null }) {
  return (
    <Wrapper>
      <Title>
        {category}
        {create && create}
      </Title>
      <PostWrapper>
        {
          items?.length > 0
            ? (
              items.map((item, index) => (
                <Post key={index} data={item} chain={chain}/>
              ))
            ) : (
              <EmptyList/>
            )
        }
      </PostWrapper>
      {pagination && <Pagination {...pagination} />}
    </Wrapper>
  );
}
