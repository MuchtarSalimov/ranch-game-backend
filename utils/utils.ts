export function assertNever(value: never) {
  throw new Error("Unexpected value: " + value);
}

export const isUserTokenMissing = (userid: unknown) => {
  if (userid && typeof userid === 'number') {
    return false;
  } else {
    return true;
  }
};