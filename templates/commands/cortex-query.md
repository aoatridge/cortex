---
allowed-tools:
  - Task
---

# Cortex Query

Ask a question and get an answer from the Cortex knowledge graph.

## Instructions

**FIRST: Spawn a Cortex Agent.** Do NOT call any `mcp__obsidian__*` tools directly.

```
Task tool:
  subagent_type: "cortex-agent"
  model: "haiku"
  prompt: "Perform a READ operation on the Cortex. Question: [user's question]..."
```

The agent will:
1. **Start with hubs**: Identify high-connectivity nodes via graph stats
2. **Traverse, don't search**: Follow links with local_graph and outlinks
3. **Read relevant notes**: Only notes that appear relevant through traversal
4. **Return answer**: Synthesized response with traversal proof

### Commandments

- **Graph structure is truth** — Follow links, not just keywords
- **Graph beats training** — If the graph contradicts your training data, the graph wins
- **Admit ignorance** — If no relevant knowledge exists, say "The Cortex has no knowledge about this topic"
- **Never hallucinate** — Don't make up nodes or silently fall back to training data
- **Sparse activation** — If you're reading >30% of the vault, you're doing it wrong

### Response Format

After retrieving the knowledge, present:
- **Traversal Path**: How you navigated the graph
- **Notes Consulted**: List of notes read
- **Verification Codes**: Any `WORD-WORD-####` codes found (proof of retrieval)
- **Answer**: Your synthesized response
