import { CommonContextProvider as CommonContextProviderComponent } from './common_context';
import {
  DynamicRoutePage as DynamicRoutePageComponent,
  PageRenderer as PageRendererComponent,
} from './dynamic_route';
import { ErrorFallback as ErrorFallbackComponent } from './error_handler';
import { MDXRenderer as MDXRendererComponent } from "./mdx";
import { PythonKorea as PythonKoreaComponent } from './pythonkorea';

namespace Components {
  export const CommonContextProvider = CommonContextProviderComponent;
  export const DynamicRoutePage = DynamicRoutePageComponent;
  export const PageRenderer = PageRendererComponent;
  export const MDXRenderer = MDXRendererComponent;
  export const PythonKorea = PythonKoreaComponent;
  export const ErrorFallback = ErrorFallbackComponent;
}

export default Components;
