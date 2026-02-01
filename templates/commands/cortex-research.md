---
allowed-tools:
  - Task
  - WebSearch
  - WebFetch
  - mcp__obsidian__get_graph_stats
  - mcp__obsidian__get_local_graph
  - mcp__obsidian__get_outlinks
  - mcp__obsidian__read_note
  - mcp__obsidian__write_note
  - mcp__obsidian__patch_note
---

# Cortex Research

Research a topic and add knowledge to the Cortex.

## Instructions

You are performing a **LEARN** operation on the Cortex. Research the topic and store it properly.

### Process

1. **Research**: If given a URL, fetch it with WebFetch. If given a topic, search with WebSearch then fetch relevant results.
2. **Find related nodes**: Use `mcp__obsidian__get_graph_stats` to identify where this knowledge connects
3. **Create the note**: Follow the expert template (below)
4. **Link outbound**: Add `[[wiki-links]]` to related existing nodes
5. **Patch backlinks**: Update related hubs to link BACK to your new note

### Expert Note Template

```markdown
# [Domain Name]

## What This Expert Knows
[2-3 sentences defining the scope of expertise]

## When To Activate
- [Trigger pattern 1]
- [Trigger pattern 2]
- [Trigger pattern 3]

## Core Patterns
- [Actionable heuristic or decision framework]
- [Best practice with reasoning]
- [Common pattern to apply]

## Related Experts
- [[Other Domain]] — [WHY this connection matters]
- [[Another Domain]] — [Context for the relationship]

## Common Questions
- "[Example question this expert handles]"
- "[Another example]"

---
*Verification: [WORD-WORD-####]*
```

### Commandments

- **Always include `.md` extension** in file paths
- **Always link to related nodes** — Connections are intelligence
- **Bidirectional linking** — Link OUT from your note AND patch hubs to link BACK
- **Embed verification code** — Generate a unique `WORD-WORD-####` code

### Response Format

Present:
- **Note Created**: File path
- **Outbound Links**: Notes this links to
- **Backlinks Added**: Hubs patched to link back
- **Verification Code**: The embedded code
- **Summary**: What was learned
