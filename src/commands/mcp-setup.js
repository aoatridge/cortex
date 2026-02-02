/**
 * cortex mcp-setup command
 *
 * Configures the MCP Obsidian server in ~/.claude.json
 */

import chalk from 'chalk';
import ora from 'ora';
import readline from 'readline';

import {
  hasMcpObsidian,
  getMcpObsidianConfig,
  configureMcpObsidian,
  detectObsidianVaults,
  isObsidianVault,
  getConfigPath,
} from '../utils/mcp-config.js';

/**
 * Prompt user for input
 * @param {string} question - Question to ask
 * @returns {Promise<string>}
 */
async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * MCP setup command handler
 * @param {object} options - Command options
 */
export async function mcpSetup(options = {}) {
  const quiet = options.quiet || false;

  if (!quiet) {
    console.log(chalk.bold('\n🔌 MCP Obsidian Setup\n'));
  }

  // Check if already configured
  try {
    if (await hasMcpObsidian()) {
      const config = await getMcpObsidianConfig();
      const vaultPath = config.args?.[config.args.length - 1] || 'unknown';

      if (!quiet) {
        console.log(chalk.green('  ✓ MCP Obsidian is already configured'));
        console.log(chalk.dim(`    Vault: ${vaultPath}`));
        console.log(chalk.dim(`    Config: ${getConfigPath()}\n`));
      } else {
        const spinner = ora('MCP configuration').start();
        spinner.succeed(`MCP already configured (vault: ${vaultPath})`);
      }
      return;
    }
  } catch (error) {
    if (error.code === 'INVALID_CONFIG_JSON') {
      console.log(chalk.red(`  Error: ${error.message}\n`));
      process.exit(1);
    }
    throw error;
  }

  // Try to detect vaults
  const spinner = ora('Detecting Obsidian vaults').start();
  const detectedVaults = await detectObsidianVaults();

  if (detectedVaults.length > 0) {
    spinner.succeed(`Found ${detectedVaults.length} vault(s)`);

    // If vault path provided via option, use it
    if (options.vault) {
      if (await isObsidianVault(options.vault)) {
        await configureVault(options.vault, quiet);
        return;
      } else {
        console.log(chalk.yellow(`  Warning: ${options.vault} doesn't look like an Obsidian vault`));
      }
    }

    // Interactive selection
    if (!quiet) {
      console.log(chalk.dim('\n  Detected vaults:'));
      detectedVaults.forEach((vault, i) => {
        console.log(chalk.dim(`    ${i + 1}. ${vault}`));
      });
      console.log('');

      const selection = await prompt(
        `  Enter vault number (1-${detectedVaults.length}) or path: `
      );

      const num = parseInt(selection, 10);
      if (num >= 1 && num <= detectedVaults.length) {
        await configureVault(detectedVaults[num - 1], quiet);
      } else if (selection) {
        if (await isObsidianVault(selection)) {
          await configureVault(selection, quiet);
        } else {
          console.log(chalk.red(`  Error: ${selection} is not a valid Obsidian vault\n`));
          process.exit(1);
        }
      } else {
        console.log(chalk.yellow('  Skipped MCP configuration.\n'));
      }
    } else {
      // Quiet mode with detected vaults but no --vault option
      // Use the first detected vault
      await configureVault(detectedVaults[0], quiet);
    }
  } else {
    spinner.warn('No Obsidian vaults detected');

    if (options.vault) {
      if (await isObsidianVault(options.vault)) {
        await configureVault(options.vault, quiet);
        return;
      } else {
        console.log(chalk.red(`  Error: ${options.vault} is not a valid Obsidian vault\n`));
        process.exit(1);
      }
    }

    if (!quiet) {
      const vaultPath = await prompt('  Enter vault path (or leave empty to skip): ');

      if (vaultPath) {
        if (await isObsidianVault(vaultPath)) {
          await configureVault(vaultPath, quiet);
        } else {
          console.log(chalk.red(`  Error: ${vaultPath} is not a valid Obsidian vault\n`));
          process.exit(1);
        }
      } else {
        console.log(chalk.yellow('\n  Skipped MCP configuration.'));
        console.log(chalk.dim('  Run `cortex mcp-setup --vault /path/to/vault` later.\n'));
      }
    }
  }
}

/**
 * Configure MCP with the given vault path
 * @param {string} vaultPath - Path to Obsidian vault
 * @param {boolean} quiet - Suppress extra output
 */
async function configureVault(vaultPath, quiet) {
  const spinner = ora('Configuring MCP Obsidian').start();

  try {
    const backupPath = await configureMcpObsidian(vaultPath);
    spinner.succeed(`MCP configured with vault: ${vaultPath}`);

    if (!quiet) {
      if (backupPath) {
        console.log(chalk.dim(`  Backup: ${backupPath}`));
      }
      console.log(chalk.dim(`  Config: ${getConfigPath()}\n`));
    }
  } catch (error) {
    spinner.fail('Failed to configure MCP');
    console.error(chalk.red(`  ${error.message}`));
    process.exit(1);
  }
}
