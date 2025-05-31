import { AccountCircle, AccountTree, Article, FilePresent } from '@mui/icons-material';

import { AdminEditorCreateRoutePage, AdminEditorModifyRoutePage } from './components/layouts/admin_editor';
import { AdminList } from './components/layouts/admin_list';
import { RouteDef } from './components/layouts/global';
import { AccountRedirectPage } from './components/pages/account/account';
import { SignInPage } from './components/pages/account/sign_in';
import { SignOutPage } from './components/pages/account/sign_out';
import { PublicFileUploadPage } from './components/pages/file/upload';
import { AdminCMSPageEditor } from './components/pages/page/editor';

export const RouteDefinitions: RouteDef[] = [
  {
    icon: AccountTree,
    title: 'CMS - 사이트맵 관리',
    app: 'cms',
    resource: 'sitemap',
    isAdminPage: true,
  },
  {
    icon: Article,
    title: 'CMS - 페이지 관리',
    app: 'cms',
    resource: 'page',
    isAdminPage: true,
  },
  {
    icon: FilePresent,
    title: '외부 노출 파일 관리',
    app: 'file',
    resource: 'publicfile',
    isAdminPage: true,
  },
  {
    icon: AccountCircle,
    title: '로그인 / 로그아웃',
    app: 'user',
    resource: 'userext',
    route: '/account',
    placeOnBottom: true,
  }
];

const buildDefaultRoutes = (app: string, resource: string) => {
  return {
    [`/${app}/${resource}/`]: <AdminList app={app} resource={resource} />,
    [`/${app}/${resource}/create`]: <AdminEditorCreateRoutePage app={app} resource={resource} />,
    [`/${app}/${resource}/:id`]: <AdminEditorModifyRoutePage app={app} resource={resource} />,
  }
};

export const RegisteredRoutes = {
  ...RouteDefinitions.filter(r => r.isAdminPage).reduce((acc, { app, resource }) => {
    return {
      ...acc,
      ...buildDefaultRoutes(app, resource),
    };
  }, {} as { [key: string]: React.ReactElement }),
  '/cms/page/create': <AdminCMSPageEditor />,
  '/cms/page/:id': <AdminCMSPageEditor />,
  '/file/publicfile/create': <PublicFileUploadPage />,
  '/file/publicfile/:id': <AdminEditorModifyRoutePage app="file" resource="publicfile" notModifiable notDeletable />,
  '/account': <AccountRedirectPage />,
  '/account/sign-in': <SignInPage />,
  '/account/sign-out': <SignOutPage />,
}
