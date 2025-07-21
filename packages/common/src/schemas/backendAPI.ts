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
    hide: boolean;
    page: string | null;
    external_link: string | null;
  };

  export type NestedSiteMapSchema = {
    id: string;
    route_code: string;
    name: string;
    order: number;
    hide: boolean;
    parent_sitemap: string | null;
    children: NestedSiteMapSchema[];
    page: string | null;
    external_link: string | null;
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

  export type SponsorTierSchema = {
    id: string;
    name: string;
    order: number;
    sponsors: {
      id: string;
      name: string;
      logo: string;
      description: string;
      tags: string[];
    }[];
  };

  export type SessionSchema = {
    id: string;
    title: string;
    description: string;
    image: string | null;
    isSession: boolean;
    categories: {
      id: string;
      name: string;
    }[];
    speakers: {
      id: string;
      nickname: string;
      biography: string;
      image: string | null;
    }[];
    room_schedules: {
      id: string;
      room_name: string;
      event_id: number;
      event_name: string;
      start_at: Date;
      end_at: Date;
    };
    call_for_presentation_schedules: {
      id: string;
      presentation_type_name: string;
      start_at: Date;
      end_at: Date;
      next_call_for_presentation_schedule: string;
    };
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
