import { toApiType } from "../../utils/viewfuncs";
import { backendApi } from "../../services/nextApi";
import { POST_UPDATE_ACTION } from "./index";

export async function fetchAndUpdatePostForUrl(dispatch, url) {
  if (!url) {
    return;
  }

  const { result: newPost } = await backendApi.fetch(url);

  if (newPost) {
    dispatch({
      type: POST_UPDATE_ACTION,
      post: newPost,
    });
  }
}

export default async function fetchAndUpdatePost(dispatch, type, postId) {
  return fetchAndUpdatePostForUrl(dispatch, `${toApiType(type)}/${postId}`);
}
