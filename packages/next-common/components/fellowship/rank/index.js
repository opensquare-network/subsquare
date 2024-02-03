import isNil from "lodash.isnil";

function getColor(rank) {
  if (6 === rank) {
    return "#52C463";
  } else if (5 === rank) {
    return "#4B97D7";
  } else if (4 === rank) {
    return "#B276EA";
  } else if (3 === rank) {
    return "#F58647";
  } else if (2 === rank) {
    return "#C3983E";
  }

  return "#728399";
}

function hexToRGB(hex, alpha = "0.15") {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

export default function FellowshipRank({ rank }) {
  const color = getColor(rank);
  if (isNil(rank)) {
    return null;
  }

  return (
    <span
      className="inline-flex w-5 h-5 rounded text12Bold items-center justify-center"
      style={{ background: hexToRGB(color), color }}
    >
      {rank}
    </span>
  );
}
