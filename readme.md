# kql-ts

Early implementation of TypeScript types for [Kirby KQL](https://github.com/getkirby/kql) queries.

Supports Tobias Moritz' [extended KQL](https://github.com/getkirby/kql/issues/45) with a `models` property for union types, but also works without it.

## Example

```ts
import { createClient } from "./kql/client";
import { KQLQueryData } from "./kql/query";

const query = {
  query: "site",
  select: {
    title: true,
    logo: {
      query: "site.logo.toFile",
      select: {
        srcset: true,
        width: true,
        height: true,
        placeholder: "file.resize(5).url",
      },
    },
    pages: {
      query: "site.children",
      select: {
        title: true,
        tags: `page.tags.split(',')`,
      },
    },
  },
} as const; // <- important

type Content = KQLQueryData<typeof query>;
/*   ^^^^^^^
{
  readonly title: string;
  readonly logo: {
      readonly srcset: string;
      readonly width: number;
      readonly height: number;
      readonly placeholder: string;
  } | null;
  readonly pages: {
      readonly title: string;
      readonly tags: string[];
  }[];
} */

const kql = createClient({
  user: KQL_USER,
  password: KQL_PASSWORD,
  url: KQL_URL,
});

const response = await kql(query);
if (response.status === "ok") {
  const data = response.result; // strongly typed!
}
```

## todo

- [ ] test! lots of things may be wrong!
- [ ] Finish `models.ts` to annotate all built in Kirby stuff
