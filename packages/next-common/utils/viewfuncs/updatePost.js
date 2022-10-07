import { toApiType } from "./index";
import nextApi from "../../services/nextApi";
import { emptyFunction } from "../index";

export default async function updatePost(type, postId, setPost = emptyFunction) {
  const url = `${ toApiType(type) }/${ postId }`;
  const { result: newPost } = await nextApi.fetch(url);
  if (newPost) {
    setPost(newPost);
  }
};
