---
allowed-tools:
  - Task
  - mcp__obsidian__get_graph_stats
  - mcp__obsidian__get_graph
  - mcp__obsidian__get_local_graph
  - mcp__obsidian__get_outlinks
  - mcp__obsidian__get_backlinks
  - mcp__obsidian__read_note
  - mcp__obsidian__read_multiple_notes
  - mcp__obsidian__write_note
  - mcp__obsidian__patch_note
---

# Cortex Optimize

Audit and optimize the Cortex knowledge graph.

## Instructions

You are performing an **OPTIMIZE** operation on the Cortex. Analyze the graph structure and make improvements.

### Process

1. **Audit current state**: Call `mcp__obsidian__get_graph_stats` for orphans, hubs, edge counts
2. **Identify issues**: Orphan nodes, missing links, weak connections, duplicates
3. **Recommend improvements**: List specific changes with reasoning
4. **Execute with approval**: Make changes (create links, merge duplicates, etc.)

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
