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
  textEscape: string;
}>;
type PluginParameters = [PluginParameter];

const textEscapes = [
  {char: '{', name: 'lbrace', to: '&#123;'},
  {char: '\n', name: 'lf', to: '<NewLine />'},
];

const plugin: Plugin<PluginParameters, Root> = function (
  { classProp, textEscape },
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
        for (const {char, name} of textEscapes) {
          node.value = node.value.replaceAll(char, textEscape + '-' + name);
        }
      }
    });
  };
};

export const processCodeHtml = async (s: string): Promise<string> => {
  const classProp = "class__" + createRandomId(4);
  const textEscape = "text__" + createRandomId(4);
  const proc = unified().use(rehypeParse, {
    fragment: true,
  })
    .use(plugin, { classProp, textEscape })
    .use(rehypeStringify);
  const file = await proc.process(s);
  let r = file.toString()
  r = r.replaceAll(classProp, "className")
  for (const {to, name} of textEscapes) {
    r = r.replaceAll(textEscape + '-' + name, to);
  }
  return "<Wrapper>" + r + "</Wrapper>";
};
