#!/usr/bin/env node

import { Command } from 'commander';
import { createRequire } from 'module';
import { init } from '../src/commands/init.js';
import { uninstall } from '../src/commands/uninstall.js';
import { upgrade } from '../src/commands/upgrade.js';
import { mcpSetup } from '../src/commands/mcp-setup.js';
import { doctor } from '../src/commands/doctor.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const program = new Command();

program
  .name('cortex')
  .description('Graph-based AI memory using Obsidian as a knowledge graph')
  .version(version);

program
  .command('init')
  .description('Install Cortex into a project')
  .argument('[path]', 'Project path (defaults to current directory)')
  .option('-f, --force', 'Overwrite existing installation')
  .option('--skip-mcp', "Don't configure MCP server")
  .option('--vault <path>', 'Obsidian vault path for MCP config')
  .action(init);

program
  .command('uninstall')
  .description('Remove Cortex from the current project')
  .option('--keep-mcp', "Don't remove MCP configuration")
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(uninstall);

program
  .command('upgrade')
  .description('Update Cortex templates to the latest version')
  .option('--check', 'Check for updates without installing')
  .action(upgrade);

program
  .command('mcp-setup')
  .description('Configure MCP server for Obsidian')
  .option('--vault <path>', 'Obsidian vault path')
  .action(mcpSetup);

program
  .command('doctor')
  .description('Verify Cortex installation is working')
  .action(doctor);

program.parse();
