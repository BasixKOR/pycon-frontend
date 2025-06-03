import { CenteredPage as CenteredPageComponent } from "./centered_page";
import { CommonContextProvider as CommonContextProviderComponent } from "./common_context";
import {
  PageIdParamRenderer as PageIdParamRendererComponent,
  PageRenderer as PageRendererComponent,
  RouteRenderer as RouteRendererComponent,
} from "./dynamic_route";
import { ErrorFallback as ErrorFallbackComponent } from "./error_handler";
import {
  LottieDebugPanel as LottieDebugPanelComponent,
  LottiePlayer as LottiePlayerComponent,
  NetworkLottiePlayer as NetworkLottiePlayerComponent,
} from "./lottie";
import { MDXRenderer as MDXRendererComponent } from "./mdx";
import type { MapPropType as MapComponentPropType } from "./mdx_components/map";
import { Map as MapComponent } from "./mdx_components/map";
import {
  PrimaryStyledDetails as PrimaryStyledDetailsComponent,
  HighlightedStyledDetails as SecondaryStyledDetailsComponent,
} from "./mdx_components/styled_details";
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
  export const LottieDebugPanel = LottieDebugPanelComponent;
  export const LottiePlayer = LottiePlayerComponent;
  export const NetworkLottiePlayer = NetworkLottiePlayerComponent;
  export const ErrorFallback = ErrorFallbackComponent;

  export namespace MDX {
    export const PrimaryStyledDetails = PrimaryStyledDetailsComponent;
    export const SecondaryStyledDetails = SecondaryStyledDetailsComponent;
    export const Map = MapComponent;
    export type MapPropType = MapComponentPropType;
  }
}

export default Components;
