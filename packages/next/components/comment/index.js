import styled from "styled-components";

import Item from "./item";
import Pagination from "components/pagination";
import NoComment from "./noComment";
import LoginButtons from "./loginButtons";
import Input from "./input";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 600px) {
    padding: 24px;
    margin: 0 -16px;
    border-radius: 0;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
`;

export default function Comments({ user, postId, data, chain }) {
  return (
    <Wrapper>
      <Title>Comments</Title>
      {data?.items?.length > 0 && (
        <>
          <div>
            {(data?.items || []).map((item, index) => (
              <Item key={index} data={item} user={user} />
            ))}
          </div>
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
          />
        </>
      )}
      {!data?.items?.length > 0 && <NoComment />}
      {!user && <LoginButtons />}
      {user && <Input postId={postId} chain={chain} />}
    </Wrapper>
  );
}
