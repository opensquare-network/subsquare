import { toApiType } from "../../utils/viewfuncs";
import nextApi from "../../services/nextApi";
import { POST_UPDATE_ACTION } from "./index";

export default async function fetchAndUpdatePost(dispatch, type, postId) {
  const { result: newPost } = await nextApi.fetch(
    `${toApiType(type)}/${postId}`,
  );

  if (newPost) {
    dispatch({
      type: POST_UPDATE_ACTION,
      post: newPost,
    });
  }
}
