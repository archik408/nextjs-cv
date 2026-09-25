---
title: The end of programming — or a shift in focus? Harness vs AI slop
description: The coder-as-translator is dead; engineering is not. With LLMs, predictability comes from a harness, a spec, and tests — otherwise you get AI slop.
date: 2026-09-22
tags: [ai, programming, testing, harness, seedling]
shelf: thinking
---

"The end of programming" — that's what [Paul Dix](https://pauldix.com/the-end-of-programming), creator of InfluxDB, titled his blog post. The spark was the news that [Bun was rewritten from Zig to Rust](https://bun.com/blog/bun-in-rust): one developer with a pre-release Claude Fable model and an army of agents (peaking around 64) drove a mechanical port from one language to another in **11 days**. The source was **500k** lines of uncommented Zig; the merge landed a diff on the order of **+1 million** lines. The scale is staggering.

Bun is a JavaScript/TypeScript runtime and toolkit — a modern alternative to Node.js and Deno. In [December 2025 Anthropic acquired Bun](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone) — partly as infrastructure around Claude Code; the project remains open source.

A migration like that used to take countless person-hours and a team of engineers deep in systems programming on fairly niche Zig and Rust (come on — these aren't Java and JavaScript).
But "the end of programming" is the wrong conclusion to draw from demos and splashy migrations. What's dead is the role of the coder-as-translator: the person who read the docs and typed code as a translation of requirements into a language the machine understands.

AI has automated that model. It's dead. Engineering is not. Generation speed is not yet system readiness.

![Comparison: one team of specialists around a single product (Golden IT Age) versus six isolated Product Engineers with AI copilots, each owning their own product (AI IT Age)](/garden/end-of-programming/golden-vs-ai-it-age.webp)

## Vibes and AI slop

> Engineers aren't needed anymore — with the best subscription to the latest model you can build anything

People with GPT Astra show off incredible 3D demo games, agents churn out clones of familiar editors and boards, and against that backdrop Miro [goes to Bending Spoons](https://investors.bendingspoons.com/newsroom/bending-spoons-agrees-to-acquire-miro) for just **$1 billion** — a holding company that buys dying startups. It was once valued at $20 billion and tipped as the next Figma, but LLMs casually spit out their own whiteboard-style tools or tracker replacements à la Jira. So why buy?

Looking at that mess, it's easy to draw the wrong conclusion: engineers aren't needed anymore, and with the best subscription to the latest model you can build anything.

In practice it can all collapse into buggy, throwaway AI slop. Rewriting a solution from one language to another is not greenfield design — and that's the key nuance. Bun had an oracle: the same **test suite**, the same **quality gates**. That was the measure of whether the LLM succeeded or failed. The trendy word for the scaffolding around an agent now is **harness**: everything we build so it delivers the expected result. Without gates, a million lines isn't a feat — it's a risk.

An AI agent generates a lot of code and navigates huge context better — that's where it beats a typical "coder." Token cost and electricity still matter, but they're secondary to the real question: how do you verify that what was generated is actually what you need?

## Non-determinism

> AI drifts toward overengineering as its idea of "perfection" and perfectionism

The models' biggest problem is that they're non-deterministic. When we used to write code, we were sure: this algorithm, run a million times, would yield the same result — a given input produces a given output. That's how math works, how physics works, how computer science used to work. AI returns different results for the same inputs. Engineers almost never faced that before: the unpredictable part of software development was the human, not the machine.

A computer engineering system must be deterministic, predictable, precise. How do you get that with AI? The answer is boring and as old as the hills: **tests**.

Engineering circles love inventing new words, but often it's just old practices repackaged. **AI Evals** as part of a harness are simply quality gates: the same code and logic checks engineers have been wiring up for years.

I have an [older note](/garden/tests-developer-should-write_en) where I sketched out the kinds of automated tests and mentioned **TST — Total System Testing**, total coverage of the system with tests. Back then I said it was a fairy tale you shouldn't chase: those suites are hard to maintain. The pragmatic balance is the [pyramid](/garden/testing-pyramid_en) or the testing trophy, coverage somewhere [around 80%](https://www.youtube.com/watch?v=qBVf-Qi6yaY).

Things have shifted a bit: agents generate tests too, so writing and fixing them got cheaper. Test broke? Regenerate it. It starts to look like you can aim for full coverage — unit, integration, system. The upside is simple: with those gates, we're less afraid of agent non-determinism. Caveat still applies: cheap tests are not the same as useful ones. A garbage generated suite is AI slop too — just from the other side.

Another false comfort move is `/multi-model-review`: let one model (or subagent) review another's output. That doesn't replace quality gates. It's the same non-determinism: a model checking a model, and what you get is probabilistic text again, not a formal check. Loops like the **Ralph loop**, which codegen sinks so much time into, are sometimes simply unjustified: agents, like machines, try to brute-force every case and edge — even when they don't need to. There's no trade-off mechanism. That used to be the human's job: owning the system's awkward corners and its imperfection. AI **drifts toward overengineering** as its idea of "perfection" and perfectionism — and without an external frame it can spin in that loop forever.

## The oracle — a path to determinism?

> And responsibility definitely sits with the human. Nobody will blame an AI agent when prod goes down: it's a machine.

There's another trendy word — the **"oracle"**. People say that's where LLM success really lives. But we need to clear the fog around the definition too. An oracle, in that usage, is something like a lead agent, a smart arbiter that holds the whole-task context and steers, reviews, and calibrates the work of fast executor agents. They can ask it for advice — a pragmatic split of model labor. The oracle is a powerful, expensive, smart model; the executors are smaller, faster flash models. But that pairing is still alchemy. Apparently it's a nod to ancient Greece: priests, oracles, seers…

For me the real oracle is an **executable check** that answers yes/no to a concrete expectation without involving a model. A markdown spec is a brief — still alchemy. The oracle is what _checks_ the brief. If the check can't light up red, it isn't an oracle — it's wishes and instructions.

Mini-example. You need login. You can tell the agent anything in chat. Markdown spec: "after a correct password the user lands in the dashboard." Still alchemy. The oracle is a test like:

```ts
it('sets session cookie on valid credentials', async () => {
  const res = await login('user@example.com', 'correct-password');
  expect(res.status).toBe(200);
  expect(res.headers['set-cookie']).toMatch(/session=/);
});
```

The agent can rewrite the handler in Express, Hapi, Hono, NestJS, or its own router. You can feed it another model, a subagent, a Ralph loop. While that test is red — no success. While it's green — the behavior under that contract exists, even if the diff looks alien. That's where the context of success lives: not in the chat history, but in a file CI runs again and again.

For Bun the "oracle" was hard and already there at migration time: the same suite for Node compatibility and runtime behavior. The [Rust-port post](https://bun.com/blog/bun-in-rust) says it outright: a mechanical port with minimal behavior changes, **the same test suite**. Agents could write `.rs` all they wanted — the measure wasn't "subagent Fable said OK," it was "all tests passed."

Without that, a million lines is risk and lottery.

Hence the rule: first a contract that can fail, then generation against it. Markdown `/plan` and OpenSpec are useful to _formulate_ an expectation and not lose it across sessions. But until the spec has grown at least one failing test, a type invariant, or a scanner with an exit code — you have a brief, not an oracle.

Tools are secondary: they **embody** pieces of the oracle. The hard core is what hits logic deterministically: [my unloved types](/garden/typescript) (`tsc`), unit/integration (Vitest/Jest). Around that — hygiene (ESLint/Oxlint, Prettier/Oxfmt); while humans still read code, you need it. E2e (Playwright) and Lighthouse are useful but often noisy; follow the testing pyramid or trophy, without fanaticism. For mass-market products — accessibility checks with axe.

For the supply chain — clear risk context, also as checks, not a paragraph in `AGENTS.md`: Semgrep on code, Trivy and `npm audit` on dependencies, Gitleaks on secrets, Syft as SBOM (artifact inventory for CVEs). CDN CSP/HSTS headers — an oracle at the edge of the runtime. Names can change, but the engineering approach is one: pin the expectation so a machine can say "no."

That set is exactly what **narrows the error class** and makes acceptance binary: the agent can hallucinate, but some of the junk gets cut until lint, types, tests, and scanners return exit code 0. That's a practical harness — not a markdown spell, not an oracle of truth, a pipeline.

But there's a trap. **Full access** for an agent is a dangerous toy of the devil. It will cheerfully walk into every gate and edit it: weaken an ESLint rule, delete a "blocking" test, widen an `allowlist`, drop a Lighthouse threshold. `ignore` and `allowlist` themselves more often **weaken** checks — and agents love blowing holes with them. You need protection for **gate configs**: CODEOWNERS / branch protection on CI, ESLint, Lighthouse thresholds, the lockfile, and a ban on the agent writing those files without human review.

Simple example. An agent will happily bump a package version if "the build needs it." It probably won't, by default, go look at CVEs (`npm audit` / Trivy) or compatibility with your users' platforms. Two options: either put that context in the plan / spec up front, or build strong gates that won't let a change through without permission from whoever owns the responsibility. And responsibility definitely sits with the human. Nobody will blame an AI agent when prod goes down: it's a machine.

## Spec first

If the system doesn't exist yet and we want to build it with AI without knowing how to program, we first need to describe expectations. Preferably as tests that will later check the agent's output.

That brings up the approach Kent Beck described — **Test-Driven Development**. How many years have people chewed on this topic? And yet in the wild the beast is barely seen: in 90% of teams, tests get written after the fact. I used to be a TDD advocate, hyped it — and then gave up: swimming against the current is hard. Beck didn't invent the approach, by the way: he found it in his father's engineering book. In early XP it was called **Test-First** — test first, then implementation. There's incredible pragmatism in that, and it has new colors now.

All of that later morphed into **Behavior-Driven Development**: first you formulate system behavior, from that — tests, then code. I think BDD is the de facto equivalent of what's now sold as **Spec-Driven Development**. They just swapped the words. Specification-Driven is the same move into a DSL that describes behavior. We need the spec first.

There are even frameworks for how to write specs — for example [OpenSpec](https://github.com/Fission-AI/OpenSpec). Funny: we used to have frameworks in programming languages, on the frontend and backend. Now we have frameworks for writing markdown correctly: a global spec, a local one, something else again. Funny or not — it's reality. And there's pragmatism in it: describe, in balance — not too detailed and not too high-level — what we want. From the specification, AI generates code. In the simplest form that's a `/plan` skill that precedes implementation and preserves the brief's context. So experienced engineers know: you brief an agent from a spec.

> Engineering is the process from design, architecture, and planning through implementation, debugging, and testing.

Implementation and debugging — the middle stretch — AI now takes on. Design and planning, the foundational phases, still sit with the engineer-programmer.

To verify the work you need precise tests — ideally before anything ships to production. Ideally they describe the behavior we want from the system. The old practices — unit, integration, e2e, BDD, TDD — stay relevant even in an era of code people no longer write by hand.

This is where the info-gypsy ad should appear, selling vibecoding courses. Those people used to teach JavaScript and React — at least some engineering was still required. Now they'll teach you how to write markdown specs correctly in Russian or English. The best training is still the same: do the work. React books already looked cringe; books on "how to vibecode markdown properly" will be the apotheosis of engineering cringe.

## AGENTS.md — we need chemistry, not alchemy

Everything about scaffolding made of natural-language rules is pure alchemy, backed at best by individual subjective takes. People are still hunting for a silver bullet — only now in markdown files, not design patterns and algorithms in a formal language. The truth is there is and will be no universal text for `AGENTS.md`. Even attempts to glue universal prompts and skills like `ponytail` "for every project" are a failed idea.

You need to shape rules for each concrete project. `AGENTS.md` should be balanced: not huge and not empty — only baseline info that's specific to the project. Everything else goes into `rules` — rules the agent follows for particular work. Models were trained on open sources, and in some areas they're weak or simply miss what matters unless you say it explicitly. Security, [accessibility](/garden/accessibility-tools-and-quality-gates_en) — half the internet has **accessibility** problems, the model was trained on those examples, so explicit rules in that category are mandatory.

Without architecture spelled out in rules and the specification, it's unclear how the agent will build the app: which libraries it picks, write its own or reuse, how to carve up **domain models (Domain-Driven Design)**. Even the simple one: Tailwind or SCSS Modules? That's technical information a person without tech understanding can't formulate.

Generating a simple brochure site with restrained design and a pleasant UI is one task; building a complex web system with hundreds of separate screens on a consistent design system is another. You need a formalized design system, order in Figma, MCP links to the tracker where tasks live and to Figma where the mocks are. Formalization of the stack and libraries, plus screenshot tests.

Can you skip formulating it? Let AI decide. AI doesn't decide — it does what the weights of its knowledge favor. The risk of sliding fast into entropy is high, where the system becomes one big, unwieldy AI slop.

Just as the endless fight with entropy used to force a developer into an inevitable meeting with refactoring, the constant rework of agent rules and the text in `rules` and `AGENTS.md` is inevitable too. You can't package a harness into a framework like React and reuse it "as is."

That's, by the way, one of the services of the future: people used to hire a services company to transform legacy; by the same logic they'll hire engineers to clean up the AI slop that non-programmers slapped together on the cheap to save on engineers.

## What survives

Principles like SOLID, YAGNI, KISS, DRY, ETC still help formulate the right expectations — of the system, and of the scaffolding that builds it.

Do you need to learn a specific language? Probably not: languages evolved for years toward DSLs so they'd stay readable for humans while remaining formal. Now they can be unreadable but optimal — the LLM will translate. The way it translates Russian to English and back.

But architectural and engineering thinking, principles, design approaches — all of that will still be needed. We need highly skilled architects and system orchestrators: people who can ask the right question and formulate thought and expectation. Executors who can't think are needed less.

Back to Bun. A million lines in eleven days is not proof that programming is over. It's proof that with a hard harness and quality gates, a non-deterministic agent can deliver a working result. Without that frame, the same scale is just a very fast path to AI slop.

---

### Related notes

- [A Visual Tutorial on Every Type of Test You Can Write](/garden/tests-developer-should-write_en)
- [The Testing Pyramid](/garden/testing-pyramid_en)
- [Real programmers don't use AI](/garden/real-programmers-dont-use-ai_en)
- [Accessibility: a developer's field guide](/garden/accessibility-tools-and-quality-gates_en)
