import { toApiType } from "./index";
import nextApi from "../../services/nextApi";
import { setPost } from "../../store/reducers/postSlice";
import { store } from "../../store";

export default async function updatePost(type, postId) {
  const url = `${ toApiType(type) }/${ postId }`;
  const { result: newPost } = await nextApi.fetch(url);
  if (newPost) {
    store.dispatch(setPost(newPost));
  }
};
