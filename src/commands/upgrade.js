/**
 * cortex-ai upgrade command
 *
 * Updates Cortex templates to the latest version.
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

import {
  hasMarkers,
  extractVersion,
  replaceMarkers,
} from '../utils/markers.js';

import {
  readClaudeMdTemplate,
  copyAgentTemplates,
  copyCommandTemplates,
} from '../utils/template-manager.js';

// Get version from package.json
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

/**
 * Upgrade command handler
 * @param {object} options - Command options
 */
export async function upgrade(options = {}) {
  const targetPath = process.cwd();
  const claudeMdPath = path.join(targetPath, 'CLAUDE.md');

  console.log(chalk.bold('\n🧠 Cortex AI Upgrade\n'));

  // Check if Cortex is installed
  if (!await fs.pathExists(claudeMdPath)) {
    console.log(chalk.yellow('Cortex is not installed in this project.'));
    console.log(chalk.dim('  Run `cortex-ai init` first.\n'));
    process.exit(1);
  }

  const content = await fs.readFile(claudeMdPath, 'utf-8');

  if (!hasMarkers(content)) {
    console.log(chalk.yellow('Cortex is not installed in this project.'));
    console.log(chalk.dim('  Run `cortex-ai init` first.\n'));
    process.exit(1);
  }

  const installedVersion = extractVersion(content);
  console.log(`  Installed: v${installedVersion}`);
  console.log(`  Available: v${version}\n`);

  // Check only mode
  if (options.check) {
    if (installedVersion === version) {
      console.log(chalk.green('  ✓ Already up to date!\n'));
    } else {
      console.log(chalk.yellow(`  ↑ Upgrade available: v${installedVersion} → v${version}`));
      console.log(chalk.dim('  Run `cortex-ai upgrade` to update.\n'));
    }
    process.exit(0);
  }

  // Check if already up to date
  if (installedVersion === version) {
    console.log(chalk.green('  Already up to date!\n'));
    process.exit(0);
  }

  // Step 1: Update CLAUDE.md
  const claudeSpinner = ora('Updating CLAUDE.md').start();

  try {
    const template = await readClaudeMdTemplate();
    const newContent = replaceMarkers(content, template, version);
    await fs.writeFile(claudeMdPath, newContent);
    claudeSpinner.succeed('Updated CLAUDE.md');
  } catch (error) {
    claudeSpinner.fail('Failed to update CLAUDE.md');
    console.error(chalk.red(`  ${error.message}`));
    process.exit(1);
  }

  // Step 2: Update command templates
  const commandSpinner = ora('Updating slash commands').start();

  try {
    const commands = await copyCommandTemplates(targetPath);
    commandSpinner.succeed(`Updated slash commands: ${commands.join(', ')}`);
  } catch (error) {
    commandSpinner.fail('Failed to update slash commands');
    console.error(chalk.red(`  ${error.message}`));
  }

  // Step 3: Update agent templates
  const agentSpinner = ora('Updating agent templates').start();

  try {
    const agents = await copyAgentTemplates(targetPath);
    agentSpinner.succeed(`Updated agent templates: ${agents.join(', ')}`);
  } catch (error) {
    agentSpinner.fail('Failed to update agent templates');
    console.error(chalk.red(`  ${error.message}`));
  }

  console.log(chalk.green.bold(`\n✅ Upgraded to Cortex v${version}!\n`));
}
