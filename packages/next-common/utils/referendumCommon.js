export const Conviction = {
  None: 0,
  Locked1x: 1,
  Locked2x: 2,
  Locked3x: 3,
  Locked4x: 4,
  Locked5x: 5,
  Locked6x: 6,
};

const AYE_BITS = 0b10000000;
const CON_MASK = 0b01111111;

export const isAye = (vote) => (vote & AYE_BITS) === AYE_BITS;
export const getConviction = (vote) => vote & CON_MASK;

export const convictionToLockX = (conviction) => {
  switch (conviction) {
    case 0:
      return "0.1x";
    case 1:
      return "1x";
    case 2:
      return "2x";
    case 3:
      return "3x";
    case 4:
      return "4x";
    case 5:
      return "5x";
    case 6:
      return "6x";
    default:
      return "0.1x";
  }
};
