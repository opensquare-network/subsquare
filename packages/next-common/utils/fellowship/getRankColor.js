export function getRankColor(rank, alpha) {
  let color = "#728399";

  if (9 === rank) {
    color = "#E54C9D";
  } else if (8 === rank) {
    color = "#1CC5B7";
  } else if (7 === rank) {
    color = "#5867EB";
  } else if (6 === rank) {
    color = "#52C463";
  } else if (5 === rank) {
    color = "#4B97D7";
  } else if (4 === rank) {
    color = "#B276EA";
  } else if (3 === rank) {
    color = "#F58647";
  } else if (2 === rank) {
    color = "#C3983E";
  }

  return hexToRGB(color, alpha);
}

function hexToRGB(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    return `rgb(${r}, ${g}, ${b})`;
  }
}
