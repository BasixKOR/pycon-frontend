import {
  AccountTree,
  AlternateEmail,
  Apartment,
  Article,
  AutoFixHigh,
  ChatBubble,
  Email,
  Event,
  FilePresent,
  FolderSpecial,
  Forum,
  Handshake,
  LocalOffer,
  Login,
  ManageAccounts,
  MarkEmailRead,
  Person,
  Public,
  ReceiptLong,
  Send,
  ShoppingBag,
  Sms,
  StickyNote2,
  VpnKey,
} from "@mui/icons-material";

import { AdminEditorCreateRoutePage, AdminEditorModifyRoutePage } from "./components/layouts/admin_editor";
import { AdminList } from "./components/layouts/admin_list";
import { RouteDef } from "./components/layouts/global";
import { AccountRedirectPage } from "./components/pages/account/account";
import { AccountManagementPage } from "./components/pages/account/manage";
import { SignInPage } from "./components/pages/account/sign_in";
import { AdminEventEditor } from "./components/pages/event/editor";
import { AdminGoogleOAuth2Editor } from "./components/pages/external_api/google_oauth2_editor";
import { PublicFileUploadPage } from "./components/pages/file/upload";
import { AdminModificationAuditList } from "./components/pages/modification_audit/list";
import { AdminModificationAuditEditor } from "./components/pages/modification_audit/pages";
import { AdminEmailTemplateEditor } from "./components/pages/notification/email_template_editor";
import { AdminKakaoAlimTalkTemplateEditor } from "./components/pages/notification/kakao_alimtalk_template_editor";
import { AdminNotificationHistoryCreate } from "./components/pages/notification/send_history_create";
import { AdminNotificationHistoryEditor } from "./components/pages/notification/send_history_result";
import { AdminSMSTemplateEditor } from "./components/pages/notification/sms_template_editor";
import { AdminCMSPageEditor } from "./components/pages/page/editor";
import { AdminPresentationEditor } from "./components/pages/presentation/editor";
import { ShopCategoryGroupEditorPage } from "./components/pages/shop/category_group/editor";
import { ShopCategoryGroupListPage } from "./components/pages/shop/category_group/list";
import { ShopOrderEditorPage } from "./components/pages/shop/order/editor";
import { ShopOrderListPage } from "./components/pages/shop/order/list";
import { ShopProductEditorPage } from "./components/pages/shop/product/editor";
import { ShopProductListPage } from "./components/pages/shop/product/list";
import { ShopTagListPage } from "./components/pages/shop/tag/list";
import { SiteMapList } from "./components/pages/sitemap/list";
import { AdminUserExtEditor } from "./components/pages/user/editor";

export const RouteDefinitions: RouteDef[] = [
  {
    type: "separator",
    key: "audit-separator",
    title: "심사",
  },
  {
    type: "routeDefinition",
    key: "modificationaudit-modificationaudit",
    icon: AutoFixHigh,
    title: "수정 심사",
    route: "/modification-audit",
  },
  {
    type: "separator",
    key: "cms-separator",
    title: "CMS",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "cms-domain-group",
    icon: Public,
    title: "도메인 그룹",
    app: "cms",
    resource: "domain-group",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "cms-sitemap",
    icon: AccountTree,
    title: "사이트맵",
    app: "cms",
    resource: "sitemap",
  },
  {
    type: "autoAdminRouteDefinition",
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
    type: "autoAdminRouteDefinition",
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
    type: "autoAdminRouteDefinition",
    key: "event-event",
    icon: Event,
    title: "행사",
    app: "event",
    resource: "event",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "event-sponsor",
    icon: Handshake,
    title: "후원사",
    app: "event",
    resource: "sponsor",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "event-presentation",
    icon: StickyNote2,
    title: "발표",
    app: "event",
    resource: "presentation",
  },
  {
    type: "separator",
    key: "shop-separator",
    title: "스토어",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "shop-category-groups",
    icon: FolderSpecial,
    title: "카테고리 그룹",
    app: "shop",
    resource: "category-groups",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "shop-tags",
    icon: LocalOffer,
    title: "태그",
    app: "shop",
    resource: "tags",
  },
  {
    type: "routeDefinition",
    key: "shop-product",
    icon: ShoppingBag,
    title: "상품",
    route: "/shop/products",
  },
  {
    type: "routeDefinition",
    key: "shop-order",
    icon: ReceiptLong,
    title: "주문",
    route: "/shop/orders",
  },
  {
    type: "separator",
    key: "notification-template-separator",
    title: "알림 템플릿",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "notification-email-template",
    icon: Email,
    title: "이메일 템플릿",
    app: "notification/email",
    resource: "template",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "notification-kakao-alimtalk-template",
    icon: Forum,
    title: "카카오 알림톡 템플릿",
    app: "notification/kakao-alimtalk",
    resource: "template",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "notification-sms-template",
    icon: Sms,
    title: "SMS 템플릿",
    app: "notification/sms",
    resource: "template",
  },
  {
    type: "separator",
    key: "notification-history-separator",
    title: "알림 발송 이력",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "notification-email-history",
    icon: MarkEmailRead,
    title: "이메일 발송 이력",
    app: "notification/email",
    resource: "history",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "notification-kakao-alimtalk-history",
    icon: ChatBubble,
    title: "카카오 알림톡 발송 이력",
    app: "notification/kakao-alimtalk",
    resource: "history",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "notification-sms-history",
    icon: Send,
    title: "SMS 발송 이력",
    app: "notification/sms",
    resource: "history",
  },
  {
    type: "separator",
    key: "external-api-separator",
    title: "외부 API",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "external-api-google-oauth2",
    icon: VpnKey,
    title: "Google OAuth2",
    app: "external-api/google",
    resource: "oauth2",
  },
  {
    type: "separator",
    key: "user-separator",
    title: "사용자",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "user-userext",
    icon: ManageAccounts,
    title: "사용자",
    app: "user",
    resource: "userext",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "user-organization",
    icon: Apartment,
    title: "조직",
    app: "user",
    resource: "organization",
  },
  {
    type: "separator",
    key: "allauth-separator",
    title: "소셜 계정 관리",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "allauth-social-app",
    icon: Login,
    title: "소셜 앱",
    app: "allauth",
    resource: "social-app",
  },
  {
    type: "routeDefinition",
    key: "allauth-social-account",
    icon: Person,
    title: "소셜 계정",
    route: "/allauth/social-account",
  },
  {
    type: "autoAdminRouteDefinition",
    key: "allauth-email-address",
    icon: AlternateEmail,
    title: "이메일 주소",
    app: "allauth",
    resource: "email-address",
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
  ...RouteDefinitions.filter((r) => r.type === "autoAdminRouteDefinition").reduce(
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
  "/notification/email/template/create": <AdminEmailTemplateEditor />,
  "/notification/email/template/:id": <AdminEmailTemplateEditor />,
  "/notification/email/history/create": <AdminNotificationHistoryCreate app="notification/email" />,
  "/notification/email/history/:id": <AdminNotificationHistoryEditor app="notification/email" />,
  "/notification/kakao-alimtalk/template": <AdminList app="notification/kakao-alimtalk" resource="template" hideCreateNew />,
  "/notification/kakao-alimtalk/template/:id": <AdminKakaoAlimTalkTemplateEditor />,
  "/notification/kakao-alimtalk/history/create": <AdminNotificationHistoryCreate app="notification/kakao-alimtalk" />,
  "/notification/kakao-alimtalk/history/:id": <AdminNotificationHistoryEditor app="notification/kakao-alimtalk" />,
  "/notification/sms/template/create": <AdminSMSTemplateEditor />,
  "/notification/sms/template/:id": <AdminSMSTemplateEditor />,
  "/notification/sms/history/create": <AdminNotificationHistoryCreate app="notification/sms" />,
  "/notification/sms/history/:id": <AdminNotificationHistoryEditor app="notification/sms" />,
  "/external-api/google/oauth2/create": <AdminGoogleOAuth2Editor />,
  "/external-api/google/oauth2/:id": <AdminGoogleOAuth2Editor />,
  "/file/publicfile/create": <PublicFileUploadPage />,
  "/file/publicfile/:id": <AdminEditorModifyRoutePage app="file" resource="publicfile" notModifiable notDeletable />,
  "/user/userext": <AdminList app="user" resource="userext" hideCreatedAt hideUpdatedAt />,
  "/user/userext/:id": <AdminUserExtEditor />,
  "/allauth/social-app": <AdminList app="allauth" resource="social-app" hideCreatedAt hideUpdatedAt />,
  "/allauth/social-account": (
    <AdminList
      app="allauth"
      resource="social-account"
      hideCreatedAt
      hideUpdatedAt
      hideCreateNew
      filterChoicesFrom={{ user: { app: "allauth", resource: "email-address" } }}
    />
  ),
  "/allauth/social-account/:id": (
    <AdminEditorModifyRoutePage app="allauth" resource="social-account" notModifiable fieldLinks={{ user: { app: "user", resource: "userext" } }} />
  ),
  "/allauth/email-address": <AdminList app="allauth" resource="email-address" hideCreatedAt hideUpdatedAt />,
  "/account": <AccountRedirectPage />,
  "/account/sign-in": <SignInPage />,
  "/account/manage": <AccountManagementPage />,
  "/cms/sitemap": <SiteMapList />,
  "/cms/sitemap/create": <SiteMapList />,
  "/cms/sitemap/:id": <SiteMapList />,
  "/event/event/create": <AdminEventEditor />,
  "/event/event/:id": <AdminEventEditor />,
  "/event/presentation/create": <AdminPresentationEditor />,
  "/event/presentation/:id": <AdminPresentationEditor />,
  "/modification-audit": <AdminModificationAuditList />,
  "/modification-audit/modification-audit/:id": <AdminModificationAuditEditor />,
  "/shop/category-groups": <ShopCategoryGroupListPage />,
  "/shop/category-groups/create": <ShopCategoryGroupEditorPage />,
  "/shop/category-groups/:id": <ShopCategoryGroupEditorPage />,
  "/shop/tags": <ShopTagListPage />,
  "/shop/products": <ShopProductListPage />,
  "/shop/products/create": <ShopProductEditorPage />,
  "/shop/products/:id": <ShopProductEditorPage />,
  "/shop/orders": <ShopOrderListPage />,
  "/shop/orders/:id": <ShopOrderEditorPage />,
};
