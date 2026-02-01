---
allowed-tools:
  - Task
  - WebSearch
  - WebFetch
---

# Cortex Research

Research a topic and add knowledge to the Cortex.

## Instructions

This is a two-phase operation:

### Phase 1: Research (Main Session)

Do the research yourself using WebSearch and WebFetch:
1. If given a URL, fetch it with WebFetch
2. If given a topic, search with WebSearch then fetch relevant results
3. Synthesize the key knowledge to store

### Phase 2: Store in Cortex (Agent)

**Spawn a Cortex Agent** to handle all graph operations:

```
Task tool:
  subagent_type: "cortex-agent"
  model: "sonnet"
  prompt: "Perform a LEARN operation. Store this knowledge: [your synthesis]..."
```

The agent will:
1. **Find related nodes**: Identify where this knowledge connects
2. **Create the note**: Following the expert template
3. **Link outbound**: Add wiki-links to related existing nodes
4. **Patch backlinks**: Update related hubs to link BACK to the new note

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
