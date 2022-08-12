const sizing = ['0.1x', '1x', '2x', '3x', '4x', '5x', '6x'];

export default function VoteLabel({ conviction, isDelegating }) {
  return `${sizing[conviction]}${isDelegating ? '/d' : ''}`;
}
