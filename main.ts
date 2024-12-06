import {remark} from 'remark'
import remarkMdx from 'remark-mdx';
import rehypeAddSlug from "@luma-dev/my-unified/rehype-add-slug";

const file = await remark()
  .use(remarkMdx)
  .use(rehypeAddSlug)
  .process(`import a from "b"\n\na <b /> c {1 + 1} d
# hello`)

console.log(String(file))
