import * as R from "remeda";

namespace BackendAPISchemas {
  export type EmptyObject = Record<string, never>;

  export type DetailedErrorSchema = {
    code: string;
    detail: string;
    attr: string | null;
  };

  export type ErrorResponseSchema = {
    type: string;
    errors: DetailedErrorSchema[];
  };

  export type FlattenedSiteMapSchema = {
    id: string;
    route_code: string;
    name: string;
    order: number;
    parent_sitemap: string | null;
    page: string;
    hide: boolean;
  };

  export type NestedSiteMapSchema = {
    id: string;
    route_code: string;
    name: string;
    order: number;
    page: string;
    hide: boolean;
    children: { [key: string]: NestedSiteMapSchema };
  };

  export type SectionSchema = {
    id: string;
    css: string;

    order: number;
    body: string;
  };

  export type PageSchema = {
    id: string;
    css: string;
    title: string;
    subtitle: string;

    show_top_title_banner: boolean;
    show_bottom_sponsor_banner: boolean;

    sections: SectionSchema[];
  };

  export const isObjectErrorResponseSchema = (obj?: unknown): obj is BackendAPISchemas.ErrorResponseSchema => {
    return (
      R.isPlainObject(obj) &&
      R.isString(obj.type) &&
      R.isArray(obj.errors) &&
      obj.errors.every((error) => {
        return R.isPlainObject(error) && R.isString(error.code) && R.isString(error.detail) && (error.attr === null || R.isString(error.attr));
      })
    );
  };
}

export default BackendAPISchemas;
