export default function bigAdd(a = 0, b = 0, c = 0, d = 0) {
  return (BigInt(a) + BigInt(b) + BigInt(c) + BigInt(d)).toString();
}
