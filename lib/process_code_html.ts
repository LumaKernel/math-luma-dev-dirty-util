import type { Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "@luma-dev/unist-util-visit-fast";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";

const createRandomId = (r = 1) => {
  let id = "";
  for (let i = 0; i < r; i++) {
    id += Math.random().toString(36).substring(2);
  }
  return id;
};

type PluginParameter = Readonly<{
  classProp: string;
  lbraceEscape: string;
}>;
type PluginParameters = [PluginParameter];

const plugin: Plugin<PluginParameters, Root> = function (
  { classProp, lbraceEscape },
) {
  return function (root: Root) {
    visit(root, (node) => {
      if (node.type === "element") {
        node.properties[classProp] = node.properties.className;
        delete node.properties.className;

        if (node.tagName === "span") {
          node.tagName = "Span";
        }
      }
      if (node.type === "text") {
        node.value = node.value.replaceAll("{", lbraceEscape);
      }
    });
  };
};

export const processCodeHtml = async (s: string): Promise<string> => {
  const classProp = "class__" + createRandomId(4);
  const lbraceEscape = "lbrace__" + createRandomId(4);
  const proc = unified().use(rehypeParse, {
    fragment: true,
  })
    .use(plugin, { classProp, lbraceEscape })
    .use(rehypeStringify);
  const file = await proc.process(s);
  const r = file.toString().replaceAll(classProp, "className").replaceAll(
    lbraceEscape,
    "&#123;",
  );
  return "<span>" + r + "</span>";
};
