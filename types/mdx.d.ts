declare module "*.mdx" {
  let MDXComponent: (props: string) => JSX.Element;
  export default MDXComponent;
}
