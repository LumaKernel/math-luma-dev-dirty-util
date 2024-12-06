import { z } from "zod";
import * as YAML from '@std/yaml';

const zMdxConfig = z.object({
  title: z.string(),
  published: z.boolean().default(false),
  termPresets: z.string().array(),
  term: z.record(z.string()),
});
export type MdxConfig = z.infer<typeof zMdxConfig>;

type MdxPreparsed = Readonly<{
  config: MdxConfig;
  content: string;
}>;

const extractConfigRaw = (mdx: string) => {
  const lines = mdx.split('\n');
  const i = lines.findIndex(e => e === '---');
  return [lines.slice(0, i).join('\n'), lines.slice(i + 1).join('\n')];
};

export type QuickTermSingle = Readonly<{
  text: string;
  ruby?: string;
  jaRuby?: string;
}>;
export type QuickTermDefinition = QuickTermSingle & Readonly<{
  short?: string;
  slug?: string;
  others?: QuickTermSingle[];
  ref?: {
    w?: {
      ja?: string;
      en?: string;
    };
  };
}>;
export type TermMapping = ReadonlyArray<Readonly<{
  name: string;
  by: string;
}>>;
export type TermPreset = Readonly<{
  name: string;
  map: TermMapping;
}>;
export type TermPresets = ReadonlyArray<TermPreset>;

export type PreParseMdxParams = Readonly<{
  mdx: string;
  termPresets: TermPresets;
}>;

export const preParseMdx = ({mdx}: PreParseMdxParams): MdxPreparsed => {
  let [config, content] = zMdxConfig.parse(YAML.parse(extractConfigRaw(mdx)));

  content = content.

  return {
    config,
    content,
  };
};
