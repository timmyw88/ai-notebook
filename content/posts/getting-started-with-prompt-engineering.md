---
title: Getting Started with Prompt Engineering
date: 2026-11-14T09:00:00Z
excerpt: Good prompts are clear, specific and give the model context. Here is a simple structure I use every day.
category: Prompting
tags: [prompts, basics]
featured: true
image: /images/prompt-engineering-cover.svg
imageAlt: Abstract illustration of a chat prompt
---

Good prompts are **clear**, **specific** and give the model **context**. When a result is disappointing, the fix is usually in the prompt, not the model.

## A simple structure

1. **Role**: who should the model be?
2. **Task**: what exactly should it do?
3. **Context**: what does it need to know?
4. **Format**: how should the answer look?

Here is a prompt that follows this structure. Click **Copy** to use it:

```prompt title="Summarize an article"
You are a helpful editor.

Summarize the text below in 3 bullet points.
Each bullet must be under 20 words.
Finish with one sentence on why it matters.

Text:
"""
{paste the article here}
"""
```

## Calling a model from code

```python
from anthropic import Anthropic

client = Anthropic()
reply = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=500,
    messages=[{"role": "user", "content": "Explain embeddings in one paragraph."}],
)
print(reply.content[0].text)
```

## Comparing prompt styles

| Style      | Good for                  | Weakness                 |
| ---------- | ------------------------- | ------------------------ |
| Zero-shot  | Quick, simple tasks       | Inconsistent formatting  |
| Few-shot   | Matching a specific style | Longer prompts           |
| Step-by-step | Reasoning and math      | Slower, more tokens      |

> Tip: keep a collection of prompts that worked. That is what this blog is for.

## A video worth watching

Put a YouTube link on its own line and it becomes an embedded video:

https://www.youtube.com/watch?v=dQw4w9WgXcQ
