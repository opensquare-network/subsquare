import { isPaseoChain } from "./chain";

export default function isPaseo() {
  return isPaseoChain(process.env.NEXT_PUBLIC_CHAIN);
}
