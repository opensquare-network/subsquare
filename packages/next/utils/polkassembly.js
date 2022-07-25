async function fetchGraphql(query) {
  try {
    const controller = new AbortController();
    const resp = await fetch(
      `https://${process.env.NEXT_PUBLIC_CHAIN}.polkassembly.io/v1/graphql`,
      {
        method: "POST",
        body: query,
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      }
    );
    setTimeout(() => controller.abort(), 10000);

    if (!resp.ok) {
      return null;
    }

    const result = await resp.json();
    return result;
  } catch (e) {
    console.error(e.message);
    return null;
  }
}

export async function queryPostComments(postId, page = 0, pageSize = 10) {
  const offset = page * pageSize;
  const limit = pageSize;

  const query = `
    {
      "operationName": "PostComments",
      "variables": {
          "id": ${postId},
          "offset": ${offset},
          "limit": ${limit}
      },
      "query": "
        query PostComments($id: Int!, $offset: Int! = 0, $limit: Int! = 20) {
          posts(where: {id: {_eq: $id}}) {
            ...discussionPost
            __typename
          }
        }

        fragment discussionPost on posts {
          post_reactions {
            ...postReactionFields
            __typename
          }
          comments_aggregate {
            aggregate {
              count
              __typename
            }
            __typename
          }
          comments(
            order_by: {created_at: asc}
            offset: $offset
            limit: $limit
          ) {
            ...commentFields
            __typename
          }
          id
          title
          __typename
        }

        fragment postReactionFields on post_reactions {
          id
          reacting_user {
            id
            username
            __typename
          }
          reaction
          created_at
          updated_at
          __typename
        }

        fragment commentFields on comments {
          comment_reactions {
            ...commentReactionFields
            __typename
          }
          id
          author {
            ...authorFields
            __typename
          }
          replies {
            ...replyFields
            __typename
          }
          content
          created_at
          updated_at
          __typename
        }

        fragment authorFields on User {
          id
          kusama_default_address
          polkadot_default_address
          username
          __typename
        }

        fragment commentReactionFields on comment_reactions {
          id
          reacting_user {
            id
            username
            __typename
          }
          reaction
          created_at
          updated_at
          __typename
        }

        fragment replyFields on replies {
          id
          author {
            ...authorFields
            __typename
          }
          comment_id
          content
          created_at
          updated_at
          __typename
        }
      "
    }
  `;

  const result = await fetchGraphql(query);
  return result?.data?.posts?.[0];
}
