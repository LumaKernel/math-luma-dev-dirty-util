import { assertEquals } from "@std/assert";
import { processCodeHtml } from "./process_code_html.ts";

Deno.test(
  { permissions: { read: true } },
  async function test_process_code_html() {
    assertEquals(
      await processCodeHtml(
        '<span class="foo bar">hi</span><span class="hello">{</span>',
      ),
      '<span><Span className="foo bar">hi</Span><Span className="hello">&#123;</Span></span>',
    );
    assertEquals(
      await processCodeHtml('<span className="className">foo&#123;</span>'),
      '<span><Span className="className">foo&#123;</Span></span>',
    );
    assertEquals(
      await processCodeHtml("<span>yo</span>"),
      "<span><Span>yo</Span></span>",
    );
  },
);
