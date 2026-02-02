/**
 * cortex init command
 *
 * Installs Cortex into a project by:
 * 1. Appending to CLAUDE.md (or creating it)
 * 2. Copying slash command templates
 * 3. Copying agent templates
 * 4. Configuring MCP server
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

import {
  hasMarkers,
  extractVersion,
  appendWithMarkers,
  createWithMarkers,
} from '../utils/markers.js';

import {
  readClaudeMdTemplate,
  copyAgentTemplates,
  copyCommandTemplates,
} from '../utils/template-manager.js';

import { mcpSetup } from './mcp-setup.js';

// Get version from package.json
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

/**
 * Init command handler
 * @param {string} [projectPath] - Target project path
 * @param {object} options - Command options
 */
export async function init(projectPath, options = {}) {
  const targetPath = path.resolve(projectPath || process.cwd());
  const claudeMdPath = path.join(targetPath, 'CLAUDE.md');

  console.log(chalk.bold('\n🧠 Cortex AI Installation\n'));
  console.log(`  Target: ${chalk.cyan(targetPath)}`);
  console.log(`  Version: ${chalk.cyan(version)}\n`);

  // Check if directory exists
  if (!await fs.pathExists(targetPath)) {
    console.log(chalk.red(`Error: Directory does not exist: ${targetPath}`));
    process.exit(1);
  }

  // Check for existing installation
  if (await fs.pathExists(claudeMdPath)) {
    const existingContent = await fs.readFile(claudeMdPath, 'utf-8');

    if (hasMarkers(existingContent)) {
      const installedVersion = extractVersion(existingContent);

      if (!options.force) {
        console.log(chalk.yellow(`Cortex is already installed (v${installedVersion})`));
        console.log(chalk.dim('  Use --force to reinstall or `cortex upgrade` to update\n'));
        process.exit(1);
      }

      console.log(chalk.yellow(`  Reinstalling (current: v${installedVersion})\n`));
    }
  }

  // Step 1: CLAUDE.md
  const spinner = ora('Installing CLAUDE.md instructions').start();

  try {
    const template = await readClaudeMdTemplate();

    if (await fs.pathExists(claudeMdPath)) {
      const existingContent = await fs.readFile(claudeMdPath, 'utf-8');

      if (hasMarkers(existingContent)) {
        // Replace existing installation
        const { replaceMarkers } = await import('../utils/markers.js');
        const newContent = replaceMarkers(existingContent, template, version);
        await fs.writeFile(claudeMdPath, newContent);
        spinner.succeed('Updated CLAUDE.md (replaced existing Cortex section)');
      } else {
        // Append to existing file
        const newContent = appendWithMarkers(existingContent, template, version);
        await fs.writeFile(claudeMdPath, newContent);
        spinner.succeed('Updated CLAUDE.md (appended Cortex section)');
      }
    } else {
      // Create new file
      const newContent = createWithMarkers(template, version);
      await fs.writeFile(claudeMdPath, newContent);
      spinner.succeed('Created CLAUDE.md');
    }
  } catch (error) {
    spinner.fail('Failed to update CLAUDE.md');
    console.error(chalk.red(`  ${error.message}`));
    process.exit(1);
  }

  // Step 2: Command templates
  const commandSpinner = ora('Installing slash commands').start();

  try {
    const commands = await copyCommandTemplates(targetPath);
    commandSpinner.succeed(`Installed slash commands: ${commands.join(', ')}`);
  } catch (error) {
    commandSpinner.fail('Failed to install slash commands');
    console.error(chalk.red(`  ${error.message}`));
  }

  // Step 3: Agent templates
  const agentSpinner = ora('Installing agent templates').start();

  try {
    const agents = await copyAgentTemplates(targetPath);
    agentSpinner.succeed(`Installed agent templates: ${agents.join(', ')}`);
  } catch (error) {
    agentSpinner.fail('Failed to install agent templates');
    console.error(chalk.red(`  ${error.message}`));
  }

  // Step 4: MCP configuration (unless skipped)
  if (!options.skipMcp) {
    console.log(''); // blank line
    await mcpSetup({ vault: options.vault, quiet: true });
  }

  // Success message
  console.log(chalk.green.bold('\n✅ Cortex installed successfully!\n'));

  console.log(chalk.dim('  Files created:'));
  console.log(chalk.dim('  • CLAUDE.md (Cortex instructions)'));
  console.log(chalk.dim('  • .claude/commands/cortex-optimize.md'));
  console.log(chalk.dim('  • .claude/commands/cortex-research.md'));
  console.log(chalk.dim('  • .claude/agents/cortex-agent.md\n'));

  console.log(chalk.bold('  Next steps:'));
  console.log('  1. Start Claude Code in this project');
  console.log('  2. Use /cortex-research to add knowledge');
  console.log('  3. Ask questions - Claude will query your Cortex\n');
}
