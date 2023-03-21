import assert from "assert-ts";
import { createClient } from "./client";
export * from "./query";

const { KQL_URL, KQL_USER, KQL_PASSWORD } = process.env;

assert(KQL_URL !== undefined, "KQL_URL is not defined");
assert(KQL_USER !== undefined, "KQL_USER is not defined");
assert(KQL_PASSWORD !== undefined, "KQL_PASSWORD is not defined");

export const kql = createClient({
  user: KQL_USER,
  password: KQL_PASSWORD,
  url: KQL_URL,
});
