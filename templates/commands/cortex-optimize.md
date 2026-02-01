---
allowed-tools:
  - Task
---

# Cortex Optimize

Audit and optimize the Cortex knowledge graph.

## Instructions

**FIRST: Spawn a Cortex Agent.** Do NOT call any `mcp__obsidian__*` tools directly.

```
Task tool:
  subagent_type: "cortex-agent"
  model: "sonnet"
  prompt: "Perform an OPTIMIZE operation on the Cortex..."
```

The agent will:
1. **Audit current state**: Get graph stats for orphans, hubs, edge counts
2. **Identify issues**: Orphan nodes, missing links, weak connections, duplicates
3. **Recommend improvements**: List specific changes with reasoning
4. **Return findings**: Condensed report back to main session

After receiving the agent's report, present it to the user and ask for approval before having the agent execute changes.

### What to Look For

- **Orphan nodes**: Notes with no connections (should be linked or removed)
- **Missing connections**: Topics that should link but don't
- **Duplicate concepts**: Multiple notes covering the same thing
- **Weak hubs**: Important topics with too few connections
- **Broken links**: References to non-existent notes

### Commandments

- **Create missing connections** — When you see a gap, add the link
- **Merge duplicates** — Consolidate overlapping concepts
- **Promote orphans** — Isolated notes should be linked or questioned
- **Bidirectional linking** — When adding links, add them in both directions

### Response Format

Present:
- **Current State**: Nodes, edges, orphans, top hubs
- **Issues Found**: Numbered list of problems
- **Recommended Actions**: What should be fixed and why
- **Changes Made**: What you actually changed (after approval)
