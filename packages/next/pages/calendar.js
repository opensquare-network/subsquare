import HomeLayout from "next-common/components/layout/HomeLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { flex, flex_col, gap_y } from "next-common/styles/tailwindcss";
import styled from "styled-components";

const Wrapper = styled.div`
  ${flex}
  ${flex_col}
  ${gap_y(16)}
`;

export default withLoginUserRedux(() => {
  return (
    <HomeLayout>
      <Wrapper>
        <TitleContainer>Calendar</TitleContainer>

        {/* calendar component */}

        {/* events component */}
      </Wrapper>
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async () => {
  return {
    props: {},
  };
});
