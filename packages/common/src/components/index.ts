import { CommonContextProvider as CommonContextProviderComponent } from './common_context';
import { MDXRenderer as MDXRendererComponent } from "./mdx";
import { PythonKorea as PythonKoreaComponent } from './pythonkorea';

namespace Components {
  export const CommonContextProvider = CommonContextProviderComponent;
  export const MDXRenderer = MDXRendererComponent;
  export const PythonKorea = PythonKoreaComponent;
}

export default Components;
