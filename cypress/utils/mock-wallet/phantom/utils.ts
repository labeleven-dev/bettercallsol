// Some Uint8Array we get here aren't accepted by nacl as `instanceof Uint8Array === false`
// Therefore we wrap it (again) to be very sure :)
export function forceUint8Array(arraylike: Uint8Array): Uint8Array {
  if (arraylike instanceof Uint8Array) return arraylike;

  return Uint8Array.from(arraylike);
}
