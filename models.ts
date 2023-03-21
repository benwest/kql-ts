/**
 * special props:
 * __model: name of the model in queries, e.g. `page`, `site`, `file`
 * __default: default type for the model, like when selecting `true`
 * __extra: if present, any key will work on the model, and will return this type
 * __discriminator: field which the `models` prop will use to determine the model (custom kql)[https://github.com/tobimori/web-2023-astro/tree/main/kirby/site/plugins/kql#works-with]
 */

// https://github.com/getkirby/kql/blob/42e32cb1fa3e295086af99ace08b4510f684db4f/src/Kql/Interceptors/Cms/Model.php#L24
interface AllowedMethodsForChildren {
  children: PagesModel;
  childrenAndDrafts: PagesModel;
  draft: PageModel;
  drafts: PagesModel;
  find: PageModel;
  findPageOrDraft: PageModel;
  grandChildren: PagesModel;
  hasChildren: boolean;
  hasDrafts: boolean;
  hasListedChildren: boolean;
  hasUnlistedChildren: boolean;
  index: PagesModel;
  search: PagesModel;
}

interface AllowedMethodsForFiles {
  audio: FilesModel;
  code: FilesModel;
  documents: FilesModel;
  file: FileModel;
  files: FilesModel;
  hasAudio: boolean;
  hasCode: boolean;
  hasDocuments: boolean;
  hasFiles: boolean;
  hasImages: boolean;
  hasVideos: boolean;
  image: FilesModel;
  images: FilesModel;
  videos: FilesModel;
}

interface AllowedMethodsForModels {
  apiUrl: string;
  blueprint: any;
  content: ContentModel;
  dragText: string;
  exists: boolean;
  id: string;
  mediaUrl: string;
  modified: number;
  permissions: any;
  panel: any;
  permalink: string;
  previewUrl: string;
  url: string;
}

interface AllowedMethodsForSiblings {
  indexOf: number | false;
  next: PageModel | null;
  nextAll: PagesModel;
  prev: PageModel | null;
  prevAll: PagesModel;
  siblings: PagesModel;
  hasNext: boolean;
  hasPrev: boolean;
  isFirst: boolean;
  isLast: boolean;
  isNth: boolean;
}

interface AllowedMethodsForParents {
  parent: PageModel | null;
  parentId: string | null;
  parentModel: any;
  site: SiteModel;
}

export interface SiteModel
  extends AllowedMethodsForChildren,
    AllowedMethodsForFiles,
    AllowedMethodsForModels,
    AllowedMethodsForFiles {
  __model: "site";
  __default: {
    children: string[];
    drafts: string[];
    files: string[];
    title: string;
    url: string;
  };
  __extra: FieldModel;
  blueprints: CollectionModel<any>;
  breadcrumb: string[];
  errorPage: PageModel;
  errorPageId: string;
  homePage: PageModel;
  homePageId: string;
  page: PageModel;
  pages: PagesModel;
  title: FieldModel;
}

export interface FileModel
  extends AllowedMethodsForModels,
    AllowedMethodsForParents,
    AllowedMethodsForSiblings {
  __model: "file";
  __default: string;
  __extra: FieldModel;
  blur: FileModel;
  bw: FileModel;
  crop: FileModel;
  dataUri: string;
  dimensions: DimensionsModel;
  exif: any;
  extension: string;
  filename: string;
  files: FilesModel;
  grayscale: FileModel;
  greyscale: FileModel;
  height: number;
  html: string;
  isPortrait: boolean;
  isLandscape: boolean;
  isSquare: boolean;
  mime: string;
  name: string;
  niceSize: string;
  orientation: Orientation;
  ratio: number;
  resize: FileModel;
  size: number;
  srcset: string;
  template: string;
  templateSiblings: any;
  thumb: FileModel;
  type: string;
  width: number;
}

type Orientation = "landscape" | "portrait" | "square" | false;
export interface DimensionsModel {
  __model: "dimensions";
  __default: {
    width: number;
    height: number;
    ratio: number;
    orientation: Orientation;
  };
  width: number;
  height: number;
  ratio: number;
  orientation: Orientation;
}

export interface PageModel
  extends AllowedMethodsForChildren,
    AllowedMethodsForFiles,
    AllowedMethodsForModels,
    AllowedMethodsForParents,
    AllowedMethodsForSiblings {
  __model: "page";
  __default: {
    children: string[];
    content: { [key: string]: string };
    drafts: string[];
    files: string[];
    id: string;
    intendedTemplate: string;
    isHomePage: boolean;
    num: number;
    template: string;
    title: string;
    slug: string;
    status: string;
    uid: string;
    url: string;
  };
  __extra: FieldModel;
  __discriminator: "intendedTemplate";
  blueprints: CollectionModel<any>;
  depth: number;
  hasTemplate: boolean;
  intendedTemplate: string;
  isDraft: boolean;
  isErrorPage: boolean;
  isHomePage: boolean;
  isHomeOrErrorPage: boolean;
  isListed: boolean;
  isReadable: boolean;
  isSortable: boolean;
  isUnlisted: boolean;
  num: number;
  slug: string;
  status: string;
  template: string;
  title: FieldModel;
  uid: string;
  url: string;
}

export interface ContentModel {
  __model: "content";
  __extra: FieldModel;
  __default: { [key: string]: string };
}

export interface CollectionModel<Item> {
  __collection: Item;
  __default: string[];
  chunk: CollectionModel<CollectionModel<Item>>;
  count: number;
  filterBy: CollectionModel<Item>;
  find: Item | null;
  findByKey: Item | null;
  first: Item | null;
  flip: CollectionModel<Item>;
  groupBy: CollectionModel<CollectionModel<Item>>;
  has: boolean;
  isEmpty: boolean;
  isEven: boolean;
  isNotEmpty: boolean;
  isOdd: boolean;
  keys: string[];
  last: Item | null;
  limit: CollectionModel<Item>;
  next: Item | null;
  not: CollectionModel<Item>;
  nth: Item | null;
  offset: CollectionModel<Item>;
  pagination: any;
  pluck: any[];
  prev: Item | null;
  shuffle: CollectionModel<Item>;
  slice: CollectionModel<Item>;
  sortBy: CollectionModel<Item>;
  without: CollectionModel<Item>;
}

export interface PagesModel extends CollectionModel<PageModel> {}
export interface FilesModel extends CollectionModel<FileModel> {}

export interface FieldModel {
  __model: "field";
  __default: string;
  exists: boolean;
  isEmpty: boolean;
  isFalse: boolean;
  isNotEmpty: boolean;
  isTrue: boolean;
  isValid: boolean;
  kirbytags: FieldModel;
  kirbytext: FieldModel;
  kirbytextinline: FieldModel;
  length: number;
  nl2br: FieldModel;
  replace: FieldModel;
  short: FieldModel;
  slug: FieldModel;
  smartypants: FieldModel;
  split: string[];
  toArray: any;
  toData: any;
  toDate: string | number;
  toBool: boolean;
  toFloat: number;
  toObject: ContentModel;
  toInt: number;
  toPage: PageModel | null;
  toPages: PagesModel;
  toFile: FileModel | null;
  toFiles: CollectionModel<FileModel>;
  toBlocks: CollectionModel<BlockModel>;
  toStructure: CollectionModel<StructureItemModel>;
}

export interface KirbyModel {
  __model: "kirby";
}

export interface BlockModel {
  __model: "block";
  __extra: FieldModel;
  id: string;
  type: string;
}

export interface StructureItemModel {
  __model: "structureItem";
  __extra: FieldModel;
  id: string;
}

export interface KirbyContext {
  site: SiteModel;
  file: FileModel;
  page: PageModel;
  kirby: KirbyModel;
}
