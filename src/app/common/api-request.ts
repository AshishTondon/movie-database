export interface IObject<T> {
    [key: string]: T;
  }

interface IRequest<R> {
  method: "GET" | "POST" | "PUT" | "DELETE";
  params?: IObject<string | number | boolean>;
  body?: R;
  url: string;
  stringify?: boolean;
}

const relativeUrl = "/api";
const urlPrefix = `${process.env.NEXT_PUBLIC_APP_DOMAIN ?? ""}${relativeUrl}`;

export const request = <T, R = unknown>({
  method,
  body,
  url,
  stringify = true,
}: IRequest<R>) =>
  fetch(`${urlPrefix}${url}`, {
    method: method,
    body: stringify ? body && JSON.stringify(body) : (body as FormData),
    cache: "no-store",
  })
    .then((result) => result.json())
    .then((result) => result as T)
    .catch((err: Error) => {
      console.error("Error while fetching campaign", err);
      return null;
    });
