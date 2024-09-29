/**
 * Clips a given address string by keeping the first 5 characters and the last 5 characters and
 * concatenating them with an ellipsis ("...") in between.
 *
 * @param {string} addr - The address string to be clipped.
 * @returns {string} The clipped address string.
 */
function ClipAddr(addr) {
  let front = addr.substring(0, 5);
  let end = addr.substring(51);
  let clipped = front + "..." + end;
  return clipped;
}
export default ClipAddr;
