import {
  ModelProp,
  ModelPropDeep,
  ModelPropDeepWithDefault,
  PropFromSelector,
  PropsFromSelect,
  PropsFromSelectOptional,
  ResolveQuery,
  PropsFromModels,
} from "./query";

type Model = {
  __model: "model";
  __extra: "extraField";
  __default: "defaultValue";
  __discriminator: "type";
  type: string;
  field: "definedField";
  inner: {
    value: "innerValue";
  };
  nested: Model;
  collection: {
    __collection: Model;
    __default: string[];
  };
};

const definedField: ModelProp<Model, "field"> = "definedField";
const extraField: ModelProp<Model, "extraField"> = "extraField";
const fromFunctionCall: ModelProp<Model, "field('ignored')"> = "definedField";
const fromOptional: ModelProp<Model, "field?"> = "definedField";
const fromOptional2: ModelProp<Model, "field?"> = null;
// @ts-expect-error
const notOptional: ModelProp<Model, "field"> = null;

const definedNestedField: ModelPropDeep<Model, "nested.field"> = "definedField";
const extraNestedField: ModelPropDeep<Model, "nested.extraField"> =
  "extraField";
const definedDeepNestedField: ModelPropDeep<
  Model,
  "nested.nested.nested('ignored').nested.nested.field"
> = "definedField";
const extraDeepNestedField: ModelPropDeep<
  Model,
  "nested.nested.nested('ignored').nested.nested.extraField"
> = "extraField";
// @ts-expect-error
const tooDeep: ModelPropDeep<Model, "field.blah"> = {};

const defaultValue: ModelPropDeepWithDefault<Model, "nested"> = "defaultValue";
const defaultCollectionValue: ModelPropDeepWithDefault<Model, "collection"> = [
  "hello",
];

type GlobalContext = {
  global: {
    value: "globalValue";
  };
  globalModel: Model;
};

const selectedProp: PropFromSelector<GlobalContext, Model, "field", true> =
  "definedField";
const selectedExtraProp: PropFromSelector<GlobalContext, Model, "extra", true> =
  "extraField";
const selectedAliasProp: PropFromSelector<
  GlobalContext,
  Model,
  "alias",
  "model.nested.field"
> = "definedField";
const selectedGlobalProp: PropFromSelector<
  GlobalContext,
  Model,
  "global",
  "global.value"
> = "globalValue";

type Selector = {
  field: true;
  extra: true;
  collection: true;
  global: "global.value";
  localQuery: {
    query: "model.nested";
  };
  localQueryWithSelect: {
    query: "model.nested";
    select: { field: true };
  };
  localQueryCollection: {
    query: "model.collection";
  };
  localQueryCollectionWithSelect: {
    query: "model.collection";
    select: { field: true };
  };
  globalQuery: {
    query: "global.value";
  };
  globalQueryWithSelect: {
    query: "global";
    select: { value: true };
  };
};

const selected: PropsFromSelect<GlobalContext, Model, Selector> = {
  field: "definedField",
  extra: "extraField",
  global: "globalValue",
  collection: ["hello"],
  localQuery: "defaultValue",
  localQueryWithSelect: { field: "definedField" },
  localQueryCollection: ["defaultValue"],
  localQueryCollectionWithSelect: [{ field: "definedField" }],
  globalQuery: "globalValue",
  globalQueryWithSelect: { value: "globalValue" },
};

const noSelector: PropsFromSelectOptional<GlobalContext, Model, undefined> =
  "defaultValue";
const plainValue: PropsFromSelectOptional<GlobalContext, "value", undefined> =
  "value";

const query: ResolveQuery<
  GlobalContext,
  undefined,
  { query: "globalModel.field" }
> = "definedField";

const queryWithModels: PropsFromModels<
  GlobalContext,
  Model,
  { unknownType: "model.type" },
  {
    dog: { type: true; bark: true };
    cat: { type: true; meow: true };
  }
> = { type: "dog", bark: "extraField" };

const queryWithModelsBad: PropsFromModels<
  GlobalContext,
  Model,
  { unknownType: "model.type" },
  {
    dog: { type: true; bark: true };
    cat: { type: true; meow: true };
  }
  // @ts-expect-error
> = { type: "dog", meow: "extraField" };

const collectionQuery: ResolveQuery<
  GlobalContext,
  undefined,
  { query: "globalModel.collection"; select: { field: true } }
> = [{ field: "definedField" }];

const paginatedQuery: ResolveQuery<
  GlobalContext,
  undefined,
  {
    query: "globalModel.collection";
    select: { field: true };
    pagination: { limit: 2 };
  }
> = {
  data: [{ field: "definedField" }],
  pagination: { page: 0, pages: 0, offset: 0, limit: 0, total: 0 },
};

const paginatedQueryWithModels: ResolveQuery<
  GlobalContext,
  undefined,
  {
    query: "globalModel.collection";
    select: { unknownType: "model.type" };
    models: {
      dog: { type: true; bark: true };
      cat: { type: true; meow: true };
    };
    pagination: { limit: 2 };
  }
> = {
  data: [
    { unknownType: "string" },
    { type: "dog", bark: "extraField" },
    { type: "cat", meow: "extraField" },
  ],
  pagination: { page: 0, pages: 0, offset: 0, limit: 0, total: 0 },
};
