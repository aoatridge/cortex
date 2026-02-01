# Cortex Optimize

You are running a graph optimization audit for the Cortex knowledge system.

## Your Mission

Analyze the Obsidian knowledge graph and make improvements to strengthen connections, reduce fragmentation, and improve discoverability.

## Phase 1: Audit

Use the Obsidian MCP tools to analyze the current graph state:

1. **Get graph stats** via `mcp__obsidian__get_graph_stats`
   - Note total nodes and edges
   - Identify orphan nodes (0 connections)
   - Identify top hubs (highest connectivity)
   - Check for unresolved links (broken references)

2. **Analyze hub health** via `mcp__obsidian__get_local_graph` on top 3-5 hubs
   - Are hubs well-connected to each other?
   - Are there isolated clusters?

3. **Check for issues:**
   - Orphan nodes that should be linked
   - Duplicate concepts that should be merged
   - Weak connections (nodes with only 1-2 links)
   - Missing bidirectional links

## Phase 2: Report

Present findings in this format:

```
## Graph Health Report

### Current State
- Nodes: X
- Edges: X
- Orphans: X (list them)
- Top Hubs: (name + connection count)

### Issues Found
1. [Issue type]: [Description]
2. ...

### Recommended Actions
1. [Action]: [Why it helps]
2. ...
```

## Phase 3: Optimize (with user approval)

For each recommended action, ask the user if they want to proceed. Then:

- **Link orphans**: Use `mcp__obsidian__patch_note` to add links to orphan notes AND patch related hubs to link back
- **Strengthen weak nodes**: Add contextual links to nodes with <3 connections
- **Create bridge nodes**: If two clusters should connect but don't, suggest a bridging note
- **Fix unresolved links**: Either create the missing note or remove the broken link

## Phase 4: Summary

After optimization, run `get_graph_stats` again and report:

```
## Optimization Complete

### Before → After
- Nodes: X → Y
- Edges: X → Y
- Orphans: X → Y

### Changes Made
1. [Change description]
2. ...

### Remaining Recommendations
(Any actions skipped or for future consideration)
```

## Important

- Always explain WHY a change improves the graph
- Never delete notes without explicit user approval
- Maintain the expert note template structure when editing
- Apply bidirectional linking for all new connections
