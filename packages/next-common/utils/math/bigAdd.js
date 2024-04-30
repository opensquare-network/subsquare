export default function bigAdd(a = 0, b = 0) {
  return (BigInt(a) + BigInt(b)).toString();
}
