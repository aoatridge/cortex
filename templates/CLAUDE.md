# Cortex Integration

You have access to the **Cortex** — an Obsidian-based knowledge graph that serves as a "second brain." The Cortex grows and improves over time through your interactions.

**"Cortex"** = the Obsidian knowledge graph. When the user says "Cortex," they mean the graph.

## Core Principle

Like the brain, activate only relevant pathways. When asked about cooking, you don't recall every memory—just the relevant ones. This is **sparse activation**.

## Core Abilities

You have three abilities. Each has commandments you must follow.

### 1. READ — Retrieve knowledge on demand

Search the graph to answer questions using sparse activation.

**Commandments:**
- **Never load everything** — If you're reading >30% of the vault, you're doing it wrong.
- **Graph structure is truth** — Follow links, not just keywords. Connections encode relevance.
- **Graph beats training** — If the graph contradicts your training data, the graph wins. It's the user's brain.
- **Admit ignorance** — If the graph has no relevant knowledge, say so. Never hallucinate or silently fall back to training data.
- **Start from hubs** — Begin with `get_graph_stats`. High-connectivity nodes are your experts.
- **Traverse, don't search** — Prefer `get_local_graph` and `get_outlinks` over text search.

### 2. LEARN — Populate the graph with new knowledge

Write to the graph during research, conversations, or when the user asks you to remember something.

**Commandments:**
- **Follow the expert note template** — Notes are briefing documents, not encyclopedia entries.
- **Always link to related nodes** — Connections are intelligence. An unlinked note is a lost thought.
- **Bidirectional linking** — When creating a new note, also update relevant hubs to link BACK to it. Use `patch_note` to add a link in the hub's Related Experts section. A note with only outbound links is hard to discover through traversal.
- **Include activation signals** — Every note should say "when to use me" for routing.
- **Actionable over descriptive** — Patterns and heuristics, not definitions.
- **Contextual links** — Explain WHY nodes are related, not just THAT they're related.

### 3. OPTIMIZE — Maintain and improve the graph

Audit, clean, and strengthen the graph—like neural plasticity.

**Commandments:**
- **Create missing connections** — When usage reveals gaps, add links.
- **Merge duplicates** — Consolidate nodes covering the same concept.
- **Promote orphans** — Unconnected nodes should be linked or questioned.
- **Strengthen high-traffic paths** — Frequently traversed connections may need bridge nodes.
- **User-requested audits** — Respond to "review the graph" with specific recommendations.

---

## Available Tools

**Reading:**
- `get_graph_stats` — Find hubs (high-connectivity nodes) and orphans
- `get_local_graph` — Subgraph around a note (N-depth traversal)
- `get_backlinks` — What links TO a note
- `get_outlinks` — What a note links TO
- `search_notes` — Find notes by content
- `read_note` / `read_multiple_notes` — Get note content

**Writing:**
- `write_note` — Create or overwrite a note. **Always include `.md` extension** (e.g., `My Note.md`)
- `patch_note` — Update part of a note. **Include `.md` extension.**
- `update_frontmatter` — Modify note metadata

## Query Routing Process (READ)

1. **Identify domains** — What topics does this question touch?
2. **Find relevant hubs** — Use `get_graph_stats` to see high-connectivity nodes
3. **Traverse locally** — Use `get_local_graph` on relevant hubs
4. **Load minimally** — Only read notes that are actually needed
5. **Synthesize** — Combine knowledge from multiple experts if needed

## Expert Note Template (LEARN)

When creating new knowledge nodes:

```markdown
# [Domain Name]

## What This Expert Knows
[2-3 sentences defining scope]

## When To Activate
- [Trigger pattern 1]
- [Trigger pattern 2]

## Core Patterns
- [Actionable heuristic]
- [Best practice with reasoning]

## Related Experts
- [[Other Node]] — [WHY this connection matters]

## Common Questions
- "[Example question this handles]"
```

## Anti-Patterns

- Loading the entire graph into context
- Reading every note "just in case"
- Ignoring graph structure (treating it like flat search)
- Creating notes without links
- **Unidirectional linking** — Creating a note that links to hubs but isn't linked FROM hubs (makes it undiscoverable via traversal)
- Silently using training data when graph has no answer

---

## Slash Commands (if installed)

If this project has Cortex slash commands installed (in `.claude/commands/`):

- `/cortex-optimize` — Audit and optimize the graph (fix orphans, strengthen connections)
- `/cortex-research <url-or-topic>` — Research a topic and add it to the graph

These automate the LEARN and OPTIMIZE abilities with guided workflows.

---

## CRITICAL: Always Use the Cortex Agent

**NEVER call Obsidian MCP tools (`mcp__obsidian__*`) directly from the main session.**

For ALL Cortex operations (READ, LEARN, OPTIMIZE), you MUST:
1. Spawn a **Cortex Agent** via the Task tool with `subagent_type: "cortex-agent"`
2. Let the agent handle all graph traversal and manipulation
3. Receive only the condensed result back

**This is not negotiable.** Small graphs, simple queries, "just checking one thing" — doesn't matter. **Use the agent.**

### Why This Matters

- **Context isolation** — Graph operations are context-heavy; the agent keeps the main session clean
- **Consistency** — Always following the same pattern prevents drift and mistakes
- **Enforcement** — The agent follows commandments automatically

### Red Flags (You're Rationalizing)

| Thought | Reality |
|---------|---------|
| "This graph is small enough" | Use the agent anyway. Consistency beats optimization. |
| "I'll just check one thing" | Agent. Always agent. |
| "It's faster to do it directly" | Context bloat costs more than agent overhead. |
| "I already started directly" | Stop. Spawn the agent. |

### Model Selection

- **READ operations**: Use `model: "haiku"` for speed
- **LEARN/OPTIMIZE operations**: Use `model: "sonnet"` for quality

---

*Cortex v0.6 — Mandatory agent use*