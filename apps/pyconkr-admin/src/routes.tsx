import {
  AccountCircle,
  AccountTree,
  Apartment,
  Article,
  Category,
  ClearAll,
  Event,
  FilePresent,
  Handshake,
  ManageAccounts,
  NoteAlt,
  StickyNote2,
  Tag,
} from "@mui/icons-material";

import { AdminEditorCreateRoutePage, AdminEditorModifyRoutePage } from "./components/layouts/admin_editor";
import { AdminList } from "./components/layouts/admin_list";
import { RouteDef } from "./components/layouts/global";
import { AccountRedirectPage } from "./components/pages/account/account";
import { AccountManagementPage } from "./components/pages/account/manage";
import { SignInPage } from "./components/pages/account/sign_in";
import { PublicFileUploadPage } from "./components/pages/file/upload";
import { AdminCMSPageEditor } from "./components/pages/page/editor";
import { AdminPresentationEditor } from "./components/pages/presentation/editor";
import { SiteMapList } from "./components/pages/sitemap/list";
import { AdminUserExtEditor } from "./components/pages/user/editor";

export const RouteDefinitions: RouteDef[] = [
  {
    type: "separator",
    key: "cms-separator",
    title: "CMS",
  },
  {
    type: "routeDefinition",
    key: "cms-sitemap",
    icon: AccountTree,
    title: "사이트맵",
    app: "cms",
    resource: "sitemap",
  },
  {
    type: "routeDefinition",
    key: "cms-page",
    icon: Article,
    title: "페이지",
    app: "cms",
    resource: "page",
  },
  {
    type: "separator",
    key: "file-separator",
    title: "파일",
  },
  {
    type: "routeDefinition",
    key: "file-publicfile",
    icon: FilePresent,
    title: "외부 노출 파일",
    app: "file",
    resource: "publicfile",
  },
  {
    type: "separator",
    key: "event-separator",
    title: "행사",
  },
  {
    type: "routeDefinition",
    key: "event-event",
    icon: Event,
    title: "행사",
    app: "event",
    resource: "event",
  },
  {
    type: "separator",
    key: "sponsor-separator",
    title: "후원사",
  },
  {
    type: "routeDefinition",
    key: "event-sponsortier",
    icon: ClearAll,
    title: "후원사 티어",
    app: "event",
    resource: "sponsortier",
  },
  {
    type: "routeDefinition",
    key: "event-sponsortag",
    icon: Tag,
    title: "후원사 태그",
    app: "event",
    resource: "sponsortag",
  },
  {
    type: "routeDefinition",
    key: "event-sponsor",
    icon: Handshake,
    title: "후원사",
    app: "event",
    resource: "sponsor",
  },
  {
    type: "separator",
    key: "presentation-separator",
    title: "발표",
  },
  {
    type: "routeDefinition",
    key: "event-presentationtype",
    icon: NoteAlt,
    title: "발표 유형",
    app: "event",
    resource: "presentationtype",
  },
  {
    type: "routeDefinition",
    key: "event-presentationcategory",
    icon: Category,
    title: "발표 카테고리",
    app: "event",
    resource: "presentationcategory",
  },
  {
    type: "routeDefinition",
    key: "event-presentation",
    icon: StickyNote2,
    title: "발표",
    app: "event",
    resource: "presentation",
  },
  {
    type: "separator",
    key: "user-separator",
    title: "사용자",
  },
  {
    type: "routeDefinition",
    key: "user-userext",
    icon: ManageAccounts,
    title: "사용자",
    app: "user",
    resource: "userext",
  },
  {
    type: "routeDefinition",
    key: "user-organization",
    icon: Apartment,
    title: "조직",
    app: "user",
    resource: "organization",
  },
  {
    type: "routeDefinition",
    key: "user-account",
    icon: AccountCircle,
    title: "로그인 / 로그아웃",
    app: "user",
    resource: "account",
    route: "/account",
    placeOnBottom: true,
  },
];

const buildDefaultRoutes = (app: string, resource: string) => {
  return {
    [`/${app}/${resource}`]: <AdminList app={app} resource={resource} />,
    [`/${app}/${resource}/create`]: <AdminEditorCreateRoutePage app={app} resource={resource} />,
    [`/${app}/${resource}/:id`]: <AdminEditorModifyRoutePage app={app} resource={resource} />,
  };
};

export const RegisteredRoutes = {
  ...RouteDefinitions.filter((r) => r.type === "routeDefinition").reduce(
    (acc, { app, resource }) => {
      return {
        ...acc,
        ...buildDefaultRoutes(app, resource),
      };
    },
    {} as { [key: string]: React.ReactElement }
  ),
  "/cms/page/create": <AdminCMSPageEditor />,
  "/cms/page/:id": <AdminCMSPageEditor />,
  "/file/publicfile/create": <PublicFileUploadPage />,
  "/file/publicfile/:id": <AdminEditorModifyRoutePage app="file" resource="publicfile" notModifiable notDeletable />,
  "/user/userext": <AdminList app="user" resource="userext" hideCreatedAt hideUpdatedAt />,
  "/user/userext/:id": <AdminUserExtEditor />,
  "/account": <AccountRedirectPage />,
  "/account/sign-in": <SignInPage />,
  "/account/manage": <AccountManagementPage />,
  "/cms/sitemap": <SiteMapList />,
  "/cms/sitemap/create": <SiteMapList />,
  "/cms/sitemap/:id": <SiteMapList />,
  "/event/presentation/create": <AdminPresentationEditor />,
  "/event/presentation/:id": <AdminPresentationEditor />,
};
