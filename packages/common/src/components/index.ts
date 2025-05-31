import { CenteredPage as CenteredPageComponent } from "./centered_page";
import { CommonContextProvider as CommonContextProviderComponent } from "./common_context";
import {
  PageIdParamRenderer as PageIdParamRendererComponent,
  PageRenderer as PageRendererComponent,
  RouteRenderer as RouteRendererComponent,
} from "./dynamic_route";
import { ErrorFallback as ErrorFallbackComponent } from "./error_handler";
import { MDXRenderer as MDXRendererComponent } from "./mdx";
import { MDXEditor as MDXEditorComponent } from "./mdx_editor";
import { PythonKorea as PythonKoreaComponent } from "./pythonkorea";

namespace Components {
  export const CenteredPage = CenteredPageComponent;
  export const CommonContextProvider = CommonContextProviderComponent;
  export const RouteRenderer = RouteRendererComponent;
  export const PageRenderer = PageRendererComponent;
  export const PageIdParamRenderer = PageIdParamRendererComponent;
  export const MDXEditor = MDXEditorComponent;
  export const MDXRenderer = MDXRendererComponent;
  export const PythonKorea = PythonKoreaComponent;
  export const ErrorFallback = ErrorFallbackComponent;
}

export default Components;
