function ClipAddr(addr) {
  let front = addr.substring(0, 5);
  let end = addr.substring(51);
  let clipped = front + "..." + end;
  return clipped;
}
export default ClipAddr;
