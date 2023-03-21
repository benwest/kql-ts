import { KirbyContext } from "./models";

export type ContextFromModel<TModel> = TModel extends {
  __model: infer TKey extends string;
}
  ? { [key in TKey]: TModel }
  : {};

export type ContextWithModel<
  TContext extends Record<string, any>,
  TModel
> = ContextFromModel<TModel> & TContext;

type Default<TModel> = TModel extends { __default: infer T } ? T : TModel;

type Extra<TModel> = TModel extends { __extra: infer T } ? T : never;

type ModelKey<TModel> = TModel extends Record<string, any>
  ? TModel extends { __extra: any }
    ? string
    : Exclude<keyof TModel, `__${string}`>
  : never;

type StripFunctionCall<TSegment extends string = string> =
  TSegment extends `${infer Before}(${string})${infer After}`
    ? `${Before}${After}`
    : TSegment;

// just gets the type of a property if it exists
type BaseModelProp<
  TModel extends Record<string, any>,
  TKey extends string
> = TKey extends keyof TModel ? TModel[TKey] : Extra<TModel>;

// if the property ends with ?, it's optional
type OptionalModelProp<
  TModel extends Record<string, any>,
  TKey extends string
> = TKey extends `${infer Base}?`
  ? BaseModelProp<TModel, Base> | null
  : BaseModelProp<TModel, TKey>;

// ignore function calls too
export type ModelProp<
  TModel extends Record<string, any>,
  TKey extends string
> = OptionalModelProp<TModel, StripFunctionCall<TKey>>;

// drill down into the model using a segmented query string
export type ModelPropDeep<
  Model extends Record<string, any>,
  QueryString extends string
> = QueryString extends `${infer Head}.${infer Tail}`
  ? ModelProp<Model, Head> extends infer Prop
    ? Prop extends Record<string, any>
      ? ModelPropDeep<Prop, Tail>
      : never
    : never
  : ModelProp<Model, QueryString>;

// resolve a query string to a value type
export type ModelPropDeepWithDefault<
  Model extends Record<string, any>,
  Query extends string
> = Default<ModelPropDeep<Model, Query>>;

export type KQLQuery = {
  query: string;
  select?: Select;
  models?: Models;
  pagination?: {
    limit?: number;
    page?: number;
  };
};

export type QueryString<Model> = ModelKey<Model> extends string ? `` : never;

type Selector = string | KQLQuery | true;
type Select = {
  [key: string]: string | KQLQuery | true;
};
export type PropFromSelector<
  // things we can always access, like `page()`, `file()`
  GlobalContext extends Record<string, any>,
  // local thing we are working on, like `page` or `structureItem`
  // changes when nesting queries
  CurrentModel extends Record<string, any>,
  SelectorKey extends string,
  TSelector extends Selector
> = TSelector extends KQLQuery
  ? ResolveQuery<GlobalContext, CurrentModel, TSelector>
  : TSelector extends true
  ? Default<ModelProp<CurrentModel, SelectorKey>>
  : TSelector extends string
  ? ModelPropDeepWithDefault<
      ContextWithModel<GlobalContext, CurrentModel>,
      TSelector
    >
  : never;

export type PropsFromSelect<
  GlobalContext extends Record<string, any>,
  CurrentModel extends Record<string, any>,
  TSelect extends Select
> = {
  [Key in keyof TSelect]: Key extends string
    ? PropFromSelector<GlobalContext, CurrentModel, Key, TSelect[Key]>
    : never;
};

export type PropsFromSelectOptional<
  GlobalContext extends Record<string, any>,
  CurrentModel,
  TSelect extends Select | undefined
> = TSelect extends Select
  ? CurrentModel extends Record<string, any>
    ? PropsFromSelect<GlobalContext, CurrentModel, TSelect>
    : null
  : Default<CurrentModel>;

type WithDiscriminator<T, Discriminator> = T extends {
  __discriminator: infer DiscriminatorKey extends string;
}
  ? Omit<T, DiscriminatorKey> & { [key in DiscriminatorKey]: Discriminator }
  : T;

type Models = { [key: string]: Select };
export type PropsFromModels<
  GlobalContext extends Record<string, any>,
  CurrentModel extends Record<string, any>,
  TSelect extends Select,
  TModels extends Models
> =
  | PropsFromSelect<GlobalContext, CurrentModel, TSelect>
  | {
      [Key in keyof TModels]: PropsFromSelect<
        GlobalContext,
        WithDiscriminator<CurrentModel, Key>,
        TModels[Key]
      >;
    }[keyof TModels];

export type PropsFromModelsOptional<
  GlobalContext extends Record<string, any>,
  CurrentModel,
  TSelect extends Select | undefined,
  TModels extends Models | undefined
> = TSelect extends Select
  ? CurrentModel extends Record<string, any>
    ? TModels extends Models
      ? PropsFromModels<GlobalContext, CurrentModel, TSelect, TModels>
      : PropsFromSelect<GlobalContext, CurrentModel, TSelect>
    : PropsFromSelectOptional<GlobalContext, CurrentModel, TSelect>
  : PropsFromSelectOptional<GlobalContext, CurrentModel, TSelect>;

export type PropsFromModelsWithCollections<
  GlobalContext extends Record<string, any>,
  CurrentModel,
  TSelect extends Select | undefined,
  TModels extends Models | undefined
> = CurrentModel extends {
  __collection: infer T;
}
  ? PropsFromModelsOptional<GlobalContext, T, TSelect, TModels>[]
  : PropsFromModelsOptional<GlobalContext, CurrentModel, TSelect, TModels>;

type Pagination = {
  page: number;
  pages: number;
  offset: number;
  limit: number;
  total: number;
};

type WithPagination<Data extends any[]> = {
  data: Data;
  pagination: Pagination;
};

type WithPaginationFromQuery<Data, TQuery extends KQLQuery> = Data extends any[]
  ? TQuery extends { pagination: any }
    ? WithPagination<Data>
    : Data
  : Data;

type GetFromQueryWithPagination<
  GlobalContext extends Record<string, any>,
  CurrentModel,
  TQuery extends KQLQuery
> = WithPaginationFromQuery<
  PropsFromModelsWithCollections<
    GlobalContext,
    CurrentModel,
    TQuery["select"],
    TQuery["models"]
  >,
  TQuery
>;

export type ResolveQuery<
  GlobalContext extends Record<string, any>,
  CurrentModel,
  TQuery extends KQLQuery
> = GetFromQueryWithPagination<
  GlobalContext,
  ModelPropDeep<ContextWithModel<GlobalContext, CurrentModel>, TQuery["query"]>,
  TQuery
>;

export type KQLQueryData<TQuery extends KQLQuery> = ResolveQuery<
  KirbyContext,
  undefined,
  TQuery
>;

export type KQLSelectData<
  TSelect extends Select,
  LocalContext
> = PropsFromModelsWithCollections<
  KirbyContext,
  LocalContext,
  TSelect,
  undefined
>;

export type KQLModelsData<
  TSelect extends Select,
  TModels extends Models,
  LocalContext
> = PropsFromModelsWithCollections<
  KirbyContext,
  LocalContext,
  TSelect,
  TModels
>;

export type ErrorResponse = {
  status: "error";
  message: string;
  code: number;
  exception: string;
  key: string;
  file: string;
  line: number;
  details: string[];
  route: string;
};

export type OkResponse<Result> = {
  status: "ok";
  code: 200;
  result: Result;
};

export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never
  : T;

export type KQLResponse<Result> = Expand<ErrorResponse | OkResponse<Result>>;

export type KQLQueryResponse<TQuery extends KQLQuery> = KQLResponse<
  KQLQueryData<TQuery>
>;
