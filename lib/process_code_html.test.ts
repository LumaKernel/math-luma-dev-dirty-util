import { assertEquals } from "@std/assert";
import { processCodeHtml } from "./process_code_html.ts";

Deno.test(
  { permissions: { read: true } },
  async function test_process_code_html() {
    assertEquals(
      await processCodeHtml(
        '<span class="foo bar">hi</span><span class="hello">{</span>',
      ),
      '<Wrapper><Span className="foo bar">hi</Span><Span className="hello">&#123;</Span></Wrapper>',
    );
    assertEquals(
      await processCodeHtml('<span className="className">foo&#123;</span>'),
      '<Wrapper><Span className="className">foo&#123;</Span></Wrapper>',
    );
    assertEquals(
      await processCodeHtml("<span>yo</span>"),
      "<Wrapper><Span>yo</Span></Wrapper>",
    );
    assertEquals(
      await processCodeHtml("<span>yo\nhello</span>\n"),
      "<Wrapper><Span>yo<NewLine />hello</Span><NewLine /></Wrapper>",
    );
  },
);
