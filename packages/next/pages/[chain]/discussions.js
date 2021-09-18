import List from "components/list";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi} from "services/nextApi";
import { EmptyList } from "utils/constants";
import styled from "styled-components";
import PlusIcon from "public/imgs/icons/plusInCircle.svg";
import LayoutFixedHeader from "components/layoutFixedHeader";
import { toDiscussionListItem } from "utils/viewfuncs";

const Create = styled.a`
  display: flex;
  align-items: center;
  color: #6848ff;
  font-size: 14px;
  white-space: nowrap;
  svg {
    margin-right: 8px;
  }
  cursor: pointer;
`;

export default withLoginUserRedux(({ loginUser, posts, chain }) => {
  const items = (posts.items || []).map(item => toDiscussionListItem(chain, item));

  const create = (
    <Create href="post/create">
      <PlusIcon />
      New Post
    </Create>
  );

  return (
    <LayoutFixedHeader user={loginUser} left={<Menu menu={mainMenu} />} chain={chain}>
      <List
        chain={chain}
        category={"Discussions"}
        create={create}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, chain, page_size: pageSize } = context.query;

  const [{ result: posts }] = await Promise.all([
    nextApi.fetch(`${chain}/posts`, { page: page ?? 1, pageSize: pageSize ?? 50 }),
  ]);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
    },
  };
});
