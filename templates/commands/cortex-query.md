---
allowed-tools:
  - Task
  - mcp__obsidian__get_graph_stats
  - mcp__obsidian__get_local_graph
  - mcp__obsidian__get_outlinks
  - mcp__obsidian__read_note
  - mcp__obsidian__read_multiple_notes
---

# Cortex Query

Ask a question and get an answer from the Cortex knowledge graph.

## Instructions

You are performing a **READ** operation on the Cortex. Use sparse activation to retrieve relevant knowledge.

### Process

1. **Start with hubs**: Call `mcp__obsidian__get_graph_stats` to identify high-connectivity nodes
2. **Traverse, don't search**: Use `mcp__obsidian__get_local_graph` and `mcp__obsidian__get_outlinks` to follow connections
3. **Read relevant notes**: Only read notes that appear relevant through traversal
4. **Synthesize answer**: Combine knowledge from consulted notes

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
