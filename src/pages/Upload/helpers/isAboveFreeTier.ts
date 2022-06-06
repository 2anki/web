export const MAX_UPLOAD_BYTES_FREE_USERS = 100000000;

export default function isAboveFreeTier(
  sizeInBytes: number,
  isPatron?: boolean,
): boolean {
  if (isPatron) {
    return false;
  }
  return sizeInBytes > MAX_UPLOAD_BYTES_FREE_USERS;
}
