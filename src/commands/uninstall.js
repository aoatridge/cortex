/**
 * cortex uninstall command
 *
 * Removes Cortex from a project by:
 * 1. Removing the Cortex section from CLAUDE.md
 * 2. Deleting Cortex command templates
 * 3. Deleting Cortex agent templates
 * 4. Optionally removing MCP configuration
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import readline from 'readline';

import {
  hasMarkers,
  extractVersion,
  removeMarkers,
} from '../utils/markers.js';

import {
  removeAgentTemplates,
  removeCommandTemplates,
} from '../utils/template-manager.js';

import {
  hasMcpObsidian,
  removeMcpObsidian,
} from '../utils/mcp-config.js';

/**
 * Prompt user for confirmation
 * @param {string} question - Question to ask
 * @returns {Promise<boolean>}
 */
async function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Uninstall command handler
 * @param {object} options - Command options
 */
export async function uninstall(options = {}) {
  const targetPath = process.cwd();
  const claudeMdPath = path.join(targetPath, 'CLAUDE.md');

  console.log(chalk.bold('\n🧠 Cortex AI Uninstall\n'));

  // Check if Cortex is installed
  let isInstalled = false;
  let installedVersion = null;

  if (await fs.pathExists(claudeMdPath)) {
    const content = await fs.readFile(claudeMdPath, 'utf-8');
    if (hasMarkers(content)) {
      isInstalled = true;
      installedVersion = extractVersion(content);
    }
  }

  if (!isInstalled) {
    console.log(chalk.yellow('Cortex is not installed in this project.\n'));
    process.exit(0);
  }

  console.log(`  Found Cortex v${installedVersion} installation\n`);

  // Confirm uninstall
  if (!options.yes) {
    const confirmed = await confirm(
      chalk.yellow('  Are you sure you want to uninstall Cortex? [y/N] ')
    );
    if (!confirmed) {
      console.log(chalk.dim('\n  Uninstall cancelled.\n'));
      process.exit(0);
    }
    console.log('');
  }

  // Step 1: Remove from CLAUDE.md
  const claudeSpinner = ora('Removing Cortex from CLAUDE.md').start();

  try {
    const content = await fs.readFile(claudeMdPath, 'utf-8');
    const newContent = removeMarkers(content);

    // Check if file would be empty (only whitespace)
    if (newContent.trim() === '') {
      await fs.remove(claudeMdPath);
      claudeSpinner.succeed('Removed CLAUDE.md (was Cortex-only)');
    } else {
      await fs.writeFile(claudeMdPath, newContent);
      claudeSpinner.succeed('Removed Cortex section from CLAUDE.md');
    }
  } catch (error) {
    claudeSpinner.fail('Failed to update CLAUDE.md');
    console.error(chalk.red(`  ${error.message}`));
  }

  // Step 2: Remove command templates
  const commandSpinner = ora('Removing slash commands').start();

  try {
    const removed = await removeCommandTemplates(targetPath);
    if (removed.length > 0) {
      commandSpinner.succeed(`Removed slash commands: ${removed.join(', ')}`);
    } else {
      commandSpinner.succeed('No Cortex slash commands found');
    }
  } catch (error) {
    commandSpinner.fail('Failed to remove slash commands');
    console.error(chalk.red(`  ${error.message}`));
  }

  // Step 3: Remove agent templates
  const agentSpinner = ora('Removing agent templates').start();

  try {
    const removed = await removeAgentTemplates(targetPath);
    if (removed.length > 0) {
      agentSpinner.succeed(`Removed agent templates: ${removed.join(', ')}`);
    } else {
      agentSpinner.succeed('No Cortex agent templates found');
    }
  } catch (error) {
    agentSpinner.fail('Failed to remove agent templates');
    console.error(chalk.red(`  ${error.message}`));
  }

  // Step 4: MCP configuration
  try {
    if (!options.keepMcp && await hasMcpObsidian()) {
      console.log('');
      const removeMcp = options.yes || await confirm(
        chalk.yellow('  Remove MCP Obsidian configuration from ~/.claude.json? [y/N] ')
      );

      if (removeMcp) {
        const mcpSpinner = ora('Removing MCP configuration').start();
        try {
          const { removed, backupPath } = await removeMcpObsidian();
          if (removed) {
            mcpSpinner.succeed('Removed MCP Obsidian configuration');
            if (backupPath) {
              console.log(chalk.dim(`    Backup: ${backupPath}`));
            }
          } else {
            mcpSpinner.succeed('No MCP configuration to remove');
          }
        } catch (error) {
          mcpSpinner.fail('Failed to remove MCP configuration');
          console.error(chalk.red(`  ${error.message}`));
        }
      }
    }
  } catch (error) {
    if (error.code === 'INVALID_CONFIG_JSON') {
      console.log(chalk.yellow('\n  ⚠ Skipping MCP cleanup: ~/.claude.json contains invalid JSON'));
      console.log(chalk.dim(`    ${error.message}`));
    } else {
      throw error;
    }
  }

  console.log(chalk.green.bold('\n✅ Cortex uninstalled successfully!\n'));
}
