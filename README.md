# Cortex AI

Graph-based AI memory using Obsidian as a knowledge graph.

Cortex transforms your Obsidian vault into a "second brain" for AI agents. Notes become nodes, links form a knowledge graph, and Claude can read, learn, and optimize your knowledge base.

## Quick Start

```bash
# Install Cortex into any project
npx cortex-ai init

# Or specify a project path
npx cortex-ai init ./my-project
```

That's it! Claude Code will now use your Obsidian vault as its memory.

## What Gets Installed

When you run `cortex-ai init`, the following files are created:

```
your-project/
├── CLAUDE.md              # Cortex instructions (appended if exists)
└── .claude/
    ├── commands/
    │   ├── cortex-optimize.md   # /cortex-optimize command
    │   └── cortex-research.md   # /cortex-research command
    └── agents/
        └── cortex-agent.md      # Cortex Agent template
```

## Commands

### `cortex-ai init [path]`

Install Cortex into a project.

```bash
npx cortex-ai init                    # Current directory
npx cortex-ai init ./my-project       # Specific path
npx cortex-ai init --vault ~/obsidian # Specify vault location
npx cortex-ai init --skip-mcp         # Skip MCP configuration
npx cortex-ai init --force            # Reinstall over existing
```

### `cortex-ai uninstall`

Remove Cortex from the current project.

```bash
npx cortex-ai uninstall          # Interactive
npx cortex-ai uninstall -y       # Skip confirmation
npx cortex-ai uninstall --keep-mcp  # Keep MCP config
```

### `cortex-ai upgrade`

Update to the latest version.

```bash
npx cortex-ai upgrade --check    # Check for updates
npx cortex-ai upgrade            # Apply update
```

### `cortex-ai mcp-setup`

Configure the MCP Obsidian server.

```bash
npx cortex-ai mcp-setup                    # Interactive
npx cortex-ai mcp-setup --vault ~/obsidian # Specify vault
```

### `cortex-ai doctor`

Verify installation health.

```bash
npx cortex-ai doctor
```

## How It Works

### Core Abilities

1. **READ** — Query knowledge from your vault using sparse activation (only load what's needed)
2. **LEARN** — Add new knowledge with proper linking and templates
3. **OPTIMIZE** — Audit and improve graph health

### Slash Commands

Once installed, use these in Claude Code:

- `/cortex-research <url-or-topic>` — Research and add knowledge
- `/cortex-optimize` — Audit and improve the graph

### The Cortex Agent

For complex operations, Cortex spawns a specialized agent that runs in isolated context. This keeps your main session clean while the agent does heavy graph traversal.

## Philosophy

**Sparse Activation**: Like the brain, Cortex doesn't load everything at once. When you think about cooking, you don't recall every memory—just relevant pathways activate.

**Graph Structure is Truth**: Follow links, not just keywords. The connections encode what's relevant to what.

**Organic Growth**: As you add knowledge, experts emerge from high-connectivity nodes.

## Requirements

- Node.js 18+
- An Obsidian vault
- Claude Code CLI

## Configuration

Cortex uses marker-based installation in CLAUDE.md, allowing it to coexist with your existing instructions:

```markdown
<!-- CORTEX:START version="1.0.0" installed="2026-02-01" -->
[Cortex instructions here]
<!-- CORTEX:END -->
```

MCP configuration is added to `~/.claude.json`:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": ["-y", "github:aoatridge/mcp-obsidian", "/path/to/vault"]
    }
  }
}
```

## License

MIT
