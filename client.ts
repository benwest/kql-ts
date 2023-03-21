import { KQLQuery, KQLQueryResponse } from "./query";

interface ClientOptions {
  url: string;
  user: string;
  password: string;
}

export const createClient = ({ url, user, password }: ClientOptions) => {
  const auth = Buffer.from(`${user}:${password}`).toString("base64");
  const headers = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  return async <TQuery extends KQLQuery>(
    query: TQuery
  ): Promise<KQLQueryResponse<TQuery>> => {
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify(query),
      headers,
    });
    return response.json();
  };
};
