/**
 * A number's digits as a string, with the decimal point and any trailing zeros dropped:
 * `0.00255` gives `"000255"`, `1.2040` gives `"1204"`, `100` gives `"1"`.
 *
 * Callers use its length to decide whether a number is too long to show in full and should be
 * abbreviated instead, so what matters is how many digits come back. The result used to be
 * joined with the separator `Array.prototype.join()` falls back to, which put a comma between
 * every digit and inflated that length: six digits came out as an eleven character string and
 * tripped the callers' `>= 11` test, so `0.00255` was abbreviated to `0` and `25.49745` to
 * `25.5`. Joining without a separator leaves the length equal to the digit count, which is the
 * eleven the callers were written against.
 */
export function getEffectiveNumbers(n) {
  const result = [];
  let flag = false;
  n.toString()
    .split("")
    .reverse()
    .forEach((dig) => {
      if (!isNaN(parseInt(dig))) {
        flag = flag || parseInt(dig) > 0;
        flag && result.push(dig);
      }
    });
  return result.reverse().join("");
}
