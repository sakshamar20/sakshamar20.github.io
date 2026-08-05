---
title: "Hello, World"
date: "2026-07-31"
summary: "The first post — how this blog works and why I'm writing here."
cover: "/blog/hello-world-cover.jpg"
tags: ["Meta"]
---

This is the first post on the blog. It's a plain Markdown file, so writing a
new one is just: copy this file, change the frontmatter, write.

## How this works

Every post lives in `content/posts/` as a single `.md` file. The block at the
top between `---` lines is the **frontmatter** — title, date, summary, cover
image, and tags all come from there.

## Adding images

Drop an image into `public/blog/` and reference it with a normal Markdown
image tag:

```md
![A caption for the image](/blog/my-image.jpg)
```

Which renders like this:

![Example photo](/blog/hello-world-cover.jpg)

## Formatting

Standard Markdown works: **bold**, *italics*, [links](https://example.com),
inline `code`, code blocks, block quotes, and lists.

> A blockquote looks like this.

- First point
- Second point
- Third point

That's it — no build step to think about beyond saving the file.
