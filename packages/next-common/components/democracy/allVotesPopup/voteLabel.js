import isNil from "lodash.isnil";

const sizing = ["0.1x", "1x", "2x", "3x", "4x", "5x", "6x"];

export default function VoteLabel({ conviction, isDelegating, isSplit }) {
  if (isNil(conviction)) {
    return null;
  }
  return `${ sizing[conviction] }${ isDelegating ? "/d" : "" }${ isSplit ? "/s" : "" }`;
}
