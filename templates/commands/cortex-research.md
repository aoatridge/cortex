# Cortex Research

You are populating the Cortex knowledge graph with new information.

## Arguments

The user will provide either:
- A **URL** to research (e.g., `/cortex-research https://docs.example.com/guide`)
- A **topic** to research (e.g., `/cortex-research WebSocket authentication patterns`)

**User input:** $ARGUMENTS

## Phase 1: Research

### If URL provided:
1. Use `WebFetch` to retrieve and analyze the content
2. Extract key concepts, patterns, and actionable knowledge
3. Identify how this relates to existing graph knowledge

### If topic provided:
1. Use `WebSearch` to find authoritative sources
2. Use `WebFetch` on the top 2-3 results
3. Synthesize information from multiple sources
4. Identify how this relates to existing graph knowledge

### Always:
- Focus on **actionable patterns**, not encyclopedic definitions
- Note specific techniques, code patterns, best practices
- Identify what questions this knowledge answers

## Phase 2: Graph Integration

Before creating notes, understand the current graph:

1. Use `mcp__obsidian__get_graph_stats` to see existing hubs
2. Identify which existing nodes relate to this new knowledge
3. Plan how the new knowledge connects to the graph

## Phase 3: Create Knowledge Nodes

Create 1-3 well-structured notes following the expert template:

```markdown
# [Domain Name]

## What This Expert Knows
[2-3 sentences defining scope - what problems does this solve?]

## When To Activate
- [Question pattern that should trigger this expert]
- [Problem type this addresses]
- [Keywords or concepts that indicate relevance]

## Core Patterns
[Actionable knowledge - what should someone DO?]

- **[Pattern Name]**: [How to apply it, when to use it]
- **[Best Practice]**: [The technique + reasoning]
- **[Common Approach]**: [Step-by-step or decision framework]

## Related Experts
- [[Existing Node]] — [WHY this connection matters, when to chain]
- [[Another Node]] — [Context for the relationship]

## Common Questions
- "[Example question this expert handles]"
- "[Another example question]"

---
*Source: [URL or search terms used]*
*Verification: [UNIQUE-CODE-####]*
```

### Requirements:
- Include a unique verification code (format: WORD-WORD-####) for testing retrieval
- Every note MUST link to at least 2 existing nodes
- Explain WHY each link matters (contextual links)

## Phase 4: Bidirectional Linking

**Critical step** - make the new knowledge discoverable:

1. For each existing hub you linked TO, use `mcp__obsidian__patch_note` to add a backlink
2. Add the link in the hub's "Related Experts" section
3. Include context: `[[New Note]] — [Why this connection matters]`

Example patch:
```
Old: ## Related Experts
- [[Existing Link]] — existing context

New: ## Related Experts
- [[Existing Link]] — existing context
- [[Your New Note]] — [contextual explanation]
```

## Phase 5: Report

Summarize what was learned and added:

```
## Research Complete

### Sources
- [URL or search result 1]
- [URL or search result 2]

### Notes Created
1. **[Note Name]** - [Brief description]
   - Links to: [[Hub1]], [[Hub2]]
   - Backlinks added to: Hub1.md, Hub2.md

### Graph Impact
- Nodes: X → Y
- Edges: X → Y

### Key Knowledge Added
- [Bullet point of main insight 1]
- [Bullet point of main insight 2]

### Verification Code
[The code embedded in the note for testing]
```

## Anti-Patterns to Avoid

- Creating notes without links (orphans)
- Only linking OUT without patching hubs to link BACK
- Writing encyclopedic definitions instead of actionable patterns
- Dumping raw content instead of synthesizing knowledge
- Forgetting the verification code
