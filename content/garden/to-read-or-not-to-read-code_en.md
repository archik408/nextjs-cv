---
title: To read or not to read code?
description: Four approaches to working with AI — from prompting to the agent factory. Slop grenades, review as a bottleneck, language as an abstraction, and why generated code still needs to be read.
date: 2026-10-25
tags: [ai, programming, agents, review, seedling]
shelf: thinking
---

Why does this question — which until recently sounded completely absurd — even come up? AI is to blame, of course.

Below is my braindump longread on the topic.

## Approaches to working with AI

In programming right now there are, I'd say, about four approaches to working with AI agents.

### Prompt engineering

**Prompt engineering**, or **prompting**, is essentially working in a "question — answer" mode. You could probably call it the entry level of interacting with AI: you formulate the right questions and ask them, you get answers back — maybe even snippets of code or whole functions. This phase has always existed in the job; it's just that an engineer used to take their question to Google or StackOverflow, and a bit earlier — to niche forums like JavaRanch.

If we're talking about teamwork, you could bring your question to an experienced, knowledgeable colleague: a mentor–mentee or junior–senior relationship.

Today this phase can be replaced — and already is being replaced — by chatting with an AI: it's an aggregator of topical knowledge bases, a search engine, and a senior buddy always ready to help, all in one.

The key feature of this approach is that the AI agent has no access to your project or codebase and can't see the whole context — it's just "search on steroids" that answers very specific questions, and the entire context is whatever happens to be in the chat. Basically, it's just a chat.

> I started working at this level sometime in early 2024. To diversify my toolkit I used — and still use — DeepSeek for quick search-type questions; for more substantial data and answers I go to ChatGPT or my gang of Grok bots — I call them my minions.

![A Telegram chat with a gang of Grok bots — the "minions": Minion 1 and Minion 2 solving a developer's tasks](/garden/to-read-or-not-to-read-code/grok-bots.webp)

### Agentic engineering

[Agentic engineering](https://addyosmani.com/blog/agentic-engineering/) is a mode where you've let AI, in one form or another, into your project and code, and it has access to everything it needs to take on assignments as an equal member of the team, and can gather all the necessary context on its own. That is, this is already programming through agents in an IDE like Cursor or ZCode, using tools and models like Claude or Codex with access to the codebase.

You give the agent a task, thereby launching its session. Within the session you communicate, clarify details, correct decisions that were made, review code. The AI agent here is the executor, but not an independent one: it waits for your answers to questions, can abandon the work halfway and stop, can get things wrong from the very first request. It's that subordinate of yours who needs supervision, mentoring, and steering. But it is capable of completing tasks end-to-end, where you no longer write the code or design it at a low level — you're rather the team lead and the tech lead.

The key point of this approach is that the AI agent is already a full-fledged worker: it ships complete features and solves whole tasks instead of answering with code snippets in a chat. But it's still not very independent, and you can't give it a task and leave the computer for long. You're still the person who makes more decisions than the AI itself.

> Around 2025 I started actively using this approach with Cursor, almost immediately switching to the Glow interface, where I focused on planning rather than coding, providing the agent all the context it needed — inside the codebase and outside it via the MCP protocol to the tracker, designs in Figma, and everything else — carefully surrounding the agent with ignore files, md files of working rules, sandbox settings, and keys in KeyChain.

### The agent loop

[The agent loop](https://code.claude.com/docs/en/agent-sdk/agent-loop). Real automation and autonomy begin when an AI agent's work runs as a cycle, an iterative process where the stages of planning, implementation, testing, and review follow one another without a human in the loop. A skill or a command triggers the main watcher agent, which spins up subagents for implementation — one, or several in parallel for a decomposed task.

The pragmatic approach is to bound the loops: set a finite number of cross-model or subagent review iterations, apply fixes only for critical findings and the ones the models agree on. With an [awake mechanism](/keep-screen-on), the main executor agent launches assistant agents and keeps spinning in the loop without a human until the task is done.

The machine does this work on its own: you can start a loop for the night and walk away from the computer without fear that the agent session will break or get stuck waiting for your answer.

A task's implementation loop can be built to stop strictly before creating a code change request, or it can go all the way to reviewing the change and merging it into the main branch after passing all CI/CD checks — entirely without a human.

The agent loop diagram from the Claude Code documentation: prompt → model evaluation ⇄ tool calls → final answer.

![The agent loop from the Claude Code documentation: user prompt → model evaluation, exchange with tools → final answer](/garden/to-read-or-not-to-read-code/agent-loop.webp)

> In 2026 I felt confident enough to run loops with multi-model review in Cursor, and later I stopped chasing models, switched to ZCode because juggling several VPNs was a pain, and organized subagent iterations of review and implementation with one and the same GLM model.
>
> Honestly, subjectively I lost nothing in quality: modern versions of models from almost any provider handle an average coding task well. And in my experience, pitting different models against each other via `/multi-model-review` produces a huge desync in decisions, where the number of disputes and hallucinations without consensus only grows. I ran GPT, Claude, GLM, Muse, Kimi, and Composer against each other — usually at least three different models.

![Multi-model review in Cursor: Grok, Codex, and GLM subagents reviewing one diff in parallel](/garden/to-read-or-not-to-read-code/multi-model-review.webp)

> Subagent review via `subagent_type: general-purpose` with a single model gives a more coherent result, without the unhinged perfectionism.

![Agent loop iterations in ZCode: parallel reviewer subagents return findings, the executor fixes the code](/garden/to-read-or-not-to-read-code/zcode-loop.webp)

> Every loop launched for one specific task, as long as a human doesn't intervene, turns out to be extremely token-efficient. The context doesn't change — it accumulates; there are no long pauses in the work, which makes the cache usable. In my experience, almost all loops have a cache hit rate above 90%.

![ZCode context and cache panel: 285.5K of 1M tokens used, cache hit rate 98%](/garden/to-read-or-not-to-read-code/tokens-cache.webp)

### The agent factory

[The agent factory](https://addyosmani.com/blog/software-factories/). An agent loop implements a single task, but there are usually several tasks in a day. There's still a manual step of stating the task and launching the loop: a human decides how many loops to run and how many tasks to solve in parallel. The agent factory is a higher-order loop with an orchestrator agent standing above the implementation loops.

A good analogy is the infinite game loop, or the [Event Loop in JavaScript](/event-loop), constantly spinning like a daemon waiting for tasks: watching your board in the tracking system, or a directory of md files with task descriptions.

As soon as a task appears on the board or in the directory, the orchestrator agent picks it up and launches the implementation loop from approach 3 for it.

Depending on the machine's power, resources, and settings, it decides how many tasks to take in parallel and sets up isolated working trees and environments for each one, so the implementation loops don't interfere with each other. In general, it's essentially a copy of how human teams used to work, except now the technical specialist is no longer needed — only the person stating the product or business task. Agents do everything else.

> This is the approach I deliberately avoid for now: on the one hand, because it isn't really needed in solo development; on the other, because I'm not sure I'm ready to let go of the steering wheel and floor it. Even in the third approach I don't allow the agent to create a merge request and merge it into the main branch. For now I'm somewhere exactly at that point, trying to keep the balance. Below are exactly the reflections on why I still haven't let go of the wheel.

---

I deliberately don't mention the option of not using AI at all — let it be number zero, like the first index in an array. That approach is already a relic: [if an engineer doesn't use AI at all today](/garden/real-programmers-dont-use-ai_en), they are falling far behind the industry.

The question of whether to write code yourself at all isn't up for debate — it has been decided. A human, even the most talented, smart, and disciplined in this craft, cannot type as much code as an AI agent can generate even with the simplest LLM. The recent [story of a developer of the official Telegram client for macOS](https://kod.ru/telegram-macos-kod-vruchnuyu) speaks for itself: 99.9% of the client code there is now written by AI agents, and 80–90% of the company's engineers, by his estimate, no longer write code by hand. When teams at Anthropic or OpenAI said things like that, it was hard to take seriously — they sell these tools and will keep saying it, if only for the PR. But a team of applied engineers at the world's top product — that's different.

The question is: should you read AI-generated code? Approaches one and two still let you keep everything under control and read the code with your own eyes, but they don't automate the work that much either — in the sense that this is not yet a revolution. The first approach is simply a replacement for the usual tools of search and problem research. The second is outsourcing typing — but in this scheme, stating the task, then verifying it yourself, and fixing inaccuracies yourself or asking for fixes can altogether take as much time as coding the solution yourself, and sometimes even more.

The third and especially the fourth approaches are where the real magic happens, and you start wondering: am I even needed in this development loop anymore? If a human is still in the loop, and we're waiting for them to look something over, read it, figure it out, grasp the essence and the meaning — then we are, of course, slowing the whole process down, and the automation is no longer all that autonomous.

A loop created 20 merge requests overnight, and you get to dig through them in the morning. If you don't make it — over the day and the next night, several dozen more will be added to the pile. And what if every teammate drops 20 PRs?

The idea of keeping a human inside the loop is now a subject of debate. To read or not to read the code generated by AI? Even inside the delivery pipeline: should a human review every change request, or should the AI agent carry the changes to the target branch on its own?

## You no longer need to read code, or "Catch the grenade"

> In the age of AI it is inevitable that some of the code will pass by human eyes simply because of the speed of generation and its sheer volume.

The thing is, starting as early as the second approach, the amount of code a person generates with an agent grows several-fold. If all of it waits in a queue for full human reading and verification, then the review process — like manual testing — becomes a bottleneck of monstrous proportions relative to its tiny diameter.

Tons of code will hang around waiting to be merged and tested, quietly rotting. According to [this year's reports](https://addyosmani.com/blog/agentic-code-review), code churn — code that gets rewritten or deleted soon after merging — grew by 861%, and median review time by 441%. Agent PRs are on average 51% larger than regular ones, about 28% of them merge almost instantly, and the number of PRs landing in the main branch with no review at all grew by nearly a third.

There's another interesting phenomenon: the term [slop grenade](https://www.inc.com/dan-schawbel/slop-grenade-shopify-ceo/91409879) has appeared — that's what the Shopify CEO uses. An AI agent generates a lot of code, and employees lean on AI so heavily that they shift the actual work — reading, verifying, and making sense of the result — onto the next person in the chain: the tech lead, the reviewer, the manual testers. I personally observed this phenomenon at X5, when a person rolled out a PR of five thousand lines of code without reading what was in it at all. And that code was far from the best quality.

When a reviewer receives "slop grenades" like these, they have no option but to send them back for rework and spend a ton of time pointing their finger at what needs editing. That lengthens the delivery process instead of shortening it. AI automation doesn't work — it backfires against the very people adopting it.

That's precisely why the paradigm is shifting toward approaches 3 and 4, where the loops spin with less and less human involvement, and the bet on verifying the quality of the produced code is placed on the LLMs and AI agents themselves.

What comes to the forefront is the criticality of a properly built [harness and quality gates](/garden/end-of-programming_en) to keep such loops spinning.

[Uncle Bob](https://x.com/unclebobmartin/status/2080622218527084961) — an author many engineers have followed for years, guided by his advice — stirs the pot: he has stopped reading code and now focuses on the tools and checks that force his agents to produce clean code and follow the principles.

Boris Cherny, [head of Claude Code at Anthropic](https://www.eweek.com/news/ai-writing-code-anthropic-openai/), said that 100% of his code is generated by Claude.

Today's software pioneers and old-timers agree: code doesn't need to be read.

## Lifting the limits, or "From Ruby to Rust"

Another interesting angle on reading code is expanding your competencies — or rather, lifting the limits off yourself.

[DHH at Rails World 2026](https://www.youtube.com/watch?v=vDjW_dRyKXY) was practically foaming at the mouth on stage, shouting that code no longer needs to be written or read: take the most efficient compiled language like Rust, write a server in it, replace all the clients with native implementations for each OS — and have no programming, reading, or Rust-comprehension skills whatsoever, while at it calling the language the most awkward and inhuman to read.

He backed his theses with performance numbers, which are impressive — if not for the conceptual substitution of technologies: comparing web technologies and compiled system software on performance is incorrect.

The talk is terrible; I wrote my opinion about it separately.

But nevertheless, DHH is right about one thing: without typing code, without reading code, without understanding it, you can achieve very impressive results — and that alone is a reason for discussion.

If you drop the aspect of reading and understanding code, and bracket off the fact that mastering even one programming language takes years of practice and experience, very interesting opportunities open up.

Until recently, people split into very specific competencies and specialized in narrow areas, and their number only grew: server development on the Java stack, server development on the Go stack, machine learning with Python, frontend with JavaScript, mobile development for iOS with Swift. Can one developer hold all this knowledge? Fullstack? Two or three languages? Whoever sells you that is a charlatan!

I've been working with the [web platform and JS](/garden/task-crafting_en) for quite a while, but I wouldn't claim to know everything about them. It's a very lively, ever-changing process.

And so AI seemingly removes these barriers and opens Pandora's box. The temptation not to limit yourself appears. Need to write firmware for a microcontroller? With AI I can do it in Rust. Wire up a microservice in Go? No problem — with AI I can do that too. Build a SPA in Vue.js or Svelte? Easy. As you understand, I have never shipped anything built with any of these tools to production and I'm not very familiar with their coding best practices.

[Jarred Sumner rewrote Bun from Zig to Rust](/garden/end-of-programming_en), and it looks like confirmation that code doesn't need to be read either. It's just one more abstraction now.

Devotees of this idea appeal to the fact that we don't read assembly or machine code anyway. Why should we read Rust code? We should focus on natural language rather than the formal one, and spend more time on concepts, planning, and what we want to get in the end — not on how we want to implement it.

## The evolution of programming languages

Let's try an intellectual exercise. Suppose that over a ten-year horizon everyone stopped reading code in formal languages. How will languages evolve?

Most likely, a language's evolution should head toward syntactic simplification for machines, so that the volume of information is easy and fast to process. This direction is probably bound up with languages drifting away from DSLs and closer to something invisible to humans but simple for machines.

Right now, whatever the AI generates, you can find a specialist who will read it, parse it, and understand the logic, because the code is written in syntax a human has worked with for years.

If new codebases go unread while the language itself evolves for machines and degrades for humans, then over time we won't be able to find an engineer who can read it and make sense of it.

James Douma, a well-known independent analyst of Tesla's FSD neural networks, wrote that he "might never look at the source again" — just as he once stopped looking at assembly, because he trusted the compiler to get it right. [Elon Musk replied](https://x.com/elonmusk/status/2084304083851034949) that this is exactly right, and that the next step is getting rid of source code entirely and generating efficient binary code directly with AI. Science fiction?

In reality, predicting what will happen to any given programming language is very, very hard.

Java was created as a fashionable replacement for C/C++, and in the '90s it was a way to lure talented engineers to your company. In the end, the language became the top choice for building web servers, not native OS applications.

JavaScript was cobbled together by Brendan Eich as a scripting language with a low entry barrier for non-engineers — designers, webmasters, and layout designers — eventually becoming a foundational technology and the standard of the entire web.

Go was meant to replace C++ in systems and OS programming, but instead became popular in server development and infrastructure, displacing microservices in Java and C# rather than C++ programs.

Scala was supposed to be a better Java — it ended up in the big data niche, where it will likely soon be displaced by Rust for good.

Kotlin was meant to be the Java killer, but ended up becoming the standard for Android mobile development.

Dart was supposed to replace JS and solve its fundamental problems: there were even experimental Chromium builds with a built-in Dart VM, but it never made it into official Chrome. [They tried to revive it with Angular 2, but TypeScript won](/garden/typescript). Its second life began in mobile development with Flutter.

Well, you get the point: prediction and futurism about programming languages is a thankless exercise. History shows that the paths of languages are hard to foresee.

![Layers of abstraction: electrical signals → machine code → assembly → high-level language → AI → natural language](/garden/to-read-or-not-to-read-code/language-abstraction.webp)

## The as-if rule

[Aaron Patterson brilliantly parried](https://www.youtube.com/watch?v=t0knYnEYBRo) DHH's claims in his closing talk at the same Rails World 2026, joking that he's ready to start selling technical debt insurance to anyone who won't read the code AI generates. He took the opposite corner — a radical one too — proclaiming that he absolutely loves using AI to throw slop grenades — yes, those very slop grenades — as if devaluing the tool in the eyes of developers.

Neither extreme works for me; I don't want to pick a corner, I like staying in the middle. In that sense, Kent Beck's thought from his [talk](https://www.youtube.com/watch?v=F8fBgDCf2Y4) at Prodacity 2026 resonates with me: he said his ambitions have always been higher than his technical skills, and now AI gives him the ability to do what used to be incredibly hard, slow, or expensive.

When I heard that, I thought: damn! That's about me.

But Patterson also lands a great hook that shatters the picture above about abstractions over machine code: AI and natural language cannot be compared to assembly — compilers operate under the [as-if](https://en.wikipedia.org/wiki/As-if_rule) rule. The "as if" rule is about the compiler's freedom to change the code — but not the result. A translator from a high-level language to machine code can rearrange the words in a sentence, drop them entirely, or replace them with synonyms — but it is obliged to keep the meaning the same.

And this amplifies my [grumbling about determinism](/garden/end-of-programming_en) in programs and its absence in AI and natural language. The as-if rule preserves determinism: it requires the compiler not to introduce new nondeterminism into the program's behavior. If a program was deterministic, it must remain so after all optimizations.

Say we have this code:

```c
int a = 2 + 3;  // The compiler can replace this with 5 right away
int b = 10;
print(a + b);   // Prints 15
```

The compiler can do this:

```c
print(15);      // Just print 15, throwing away all the variables
```

Determinism: the program always prints 15 — that's its property.

The compiler made you a promise — as-if; AI has made no such promise: "there is no As-If Rule for your English." Natural language and AI agents don't have these characteristics and don't follow such a rule — which means they cannot be treated as just one more abstraction over machine code.

## Modern languages still matter

The thing is, whatever is good in a programming language and in program code for a human is just as good for an AI agent.

Behavior-driven tests let a human clearly formulate boundaries and quality gates. Typing and linting are yet more quality gates. Semantic markup and accessibility make layout better for interpretation not only by a screen reader but also [by an AI agent](https://auditbuffet.com/patterns/ab-002624).

If the code has nothing but variables like `i` or instructions like `INT` and `JMP` with register names like `EAX`, how hard will it be for an AI agent to assemble the domain and business context? It will have to read almost the entire codebase to perform and validate even a very simple code change — never mind adding a new function.

In fact, the ubiquitous language from Domain-Driven Design is, in my view, critically important for building the right approach to working with AI, for stating tasks in a specific subject area, and for organizing code. Overall, in the age of AI, Domain-Driven Design is becoming one of the most important disciplines, in my view — and that deserves an essay of its own.

I used to like saying that when reviewing and judging code you should follow the **TUBED** rule — testable, understandable, browseable, extendable, documented. The ubiquitous language helps exactly with understandable and browseable — navigating the code and quickly finding the spots to change. This is directly connected to the economics of using AI models and tokens.

## You still need to read code

There's another interesting aspect. Discussing all this, we seem to forget about the monstrous monopoly on LLM tools. I mean specifically the top, serious tools for engineers. No local model trained inside a corporation can compete with the tools of Anthropic, OpenAI, Z.ai, Kimi, xAI, and Gemini.

The answer is simple: it's concentration and ownership of resources — data centers, access to electricity, and amounts of computing power, namely GPUs. And that's why only two big economies are represented here — the US and China. Nobody else can offer comparable tools, and even very large and rich corporations have to live with that: they pour their code onto these companies' servers to work with their cutting-edge coding models.

When we get tied to cloud providers like AWS or Cloudflare — yes, that's also dependence on a giant, but our solution is portable: you can always deploy the software on your own hardware, replace paid solutions with open-source self-hosted ones, or write your own. By the way, this is clearly visible in Russia under Western sanctions: the major players started building their own infrastructure — patching up what they had in places, building their own in others. You could call it digital sovereignty. Instead of AWS — MWS; instead of Cloudflare — Yandex. China has been there for a long time.

By [some estimates](https://epoch.ai/latest/introducing-the-ai-chip-owners-explorer), more than 70% of the world's AI compute belongs to five American hyperscalers — Amazon, Google, Meta, Microsoft, and Oracle. Around 5% belongs to Chinese companies; the rest is scattered, not concentrated in one place.

![Distribution of global AI compute by owner: over 70% with five American hyperscalers, around 5% with Chinese companies](/garden/to-read-or-not-to-read-code/ai-chip-owners.webp)

Given this unprecedented monopoly on the tools, the ability to write, read, and understand code is still critical — at the very least from a security standpoint.

A highly [telling experiment](https://www.hirundo.io/blog/qwen3-coder-vulnerabilities) happened when the Chinese Qwen3 Coder model was asked to write code for US defense infrastructure: on the same test, those applications turned out to be hackable noticeably more often — 70% versus 59% when the client was on the Chinese side. And that is why code needs to be read.

Kent Beck said in [his talk](https://www.youtube.com/watch?v=F8fBgDCf2Y4) at Prodacity 2026:

> "If I had to choose between a system that people can read and one that they can't, I would choose the one they can."

And I, like many engineers, fully agree with him here.

The ability to read code is the most important, irreplaceable skill for programmers: professionals spend significantly more time reading and understanding existing code than writing new code. While AI tools and automated testing can handle verification, they cannot replace human judgment of code quality, architecture, and intent.

A modern engineer has to be an orchestrator and a skillful administrator of AI agents. You need to know how to launch and tune AI loops, but the "read / don't read" ratio should be 20/80 by the Pareto principle, or 30/70 as [Tim Sweeney described in his tweet](https://x.com/TimSweeneyEpic/status/2111633221725122769) — the head of Epic Games, the creator of the Unreal Engine: the critical parts of the system still rest with the human, while all the remaining boilerplate scaffolding can be handed to agents.

[Human judgment shifts](https://addyosmani.com/blog/human-judgment-doesnt-leave-the-software/) so that the loops work optimally — but it definitely doesn't disappear for good.

This pragmatic approach resonates with me; it's roughly how I work right now. Somewhere between the third and fourth approach, with a trust principle of 20 to 80. I let go of the wheel and hit the gas when doing [learning projects](/garden/alice-microbit_en) or [toys](/garden/microbit-striker_en) with my kids, and I grab the wheel and brake when [users hit "white tabs" in production](/garden/pwa-recovery-observability_en).

---

### Related notes

- [[The end of programming — or a shift in focus? Harness vs AI slop](/garden/end-of-programming_en)]
- [[Real programmers don't use AI](/garden/real-programmers-dont-use-ai_en)]
- [[The Eternal TaskCraft](/garden/task-crafting_en)]
- [[TypeScript — the biggest mistake in the frontend world!](/garden/typescript)]
- [[Recovery and observability for a PWA that fails before it starts](/garden/pwa-recovery-observability_en)]
