import { toApiType } from "./index";
import nextApi from "../../services/nextApi";
import { POST_UPDATE_ACTION } from "../../context/post";

export default async function updatePost(type, postId, dispatch) {
  const url = `${ toApiType(type) }/${ postId }`;
  const { result: newPost } = await nextApi.fetch(url);

  if (newPost) {
    dispatch({
      type: POST_UPDATE_ACTION,
      post: newPost,
    });
  }
};
