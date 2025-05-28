import { toApiType } from "../../utils/viewfuncs";
import { backendApi } from "../../services/nextApi";
import { POST_UPDATE_ACTION } from "./index";

export default async function fetchAndUpdatePost(dispatch, type, postId) {
  const { result: newPost } = await backendApi.fetch(
    `${toApiType(type)}/${postId}`,
  );

  if (newPost) {
    dispatch({
      type: POST_UPDATE_ACTION,
      post: newPost,
    });
  }
}
