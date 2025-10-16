/* muhasip.utils : 15.10.2025 -> 15.10.2025  
   base64from
   base64to
   tryCatch
   */

export const base64from = (value: string) =>
  Buffer.from(value, "utf-8").toString("base64");

export const base64to = (value: string) =>
  Buffer.from(value, "base64").toString("utf-8");

type SuccessResult<T> = readonly [T, null];
type ErrorResult<E = Error> = readonly [null, E];
type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return [data, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}
