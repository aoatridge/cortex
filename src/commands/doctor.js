/**
 * cortex-ai doctor command
 *
 * Verifies that Cortex is properly installed and configured.
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

import {
  hasMarkers,
  extractVersion,
} from '../utils/markers.js';

import {
  getInstalledTemplates,
  getAvailableTemplates,
} from '../utils/template-manager.js';

import {
  hasMcpObsidian,
  getMcpObsidianConfig,
  isObsidianVault,
  getConfigPath,
} from '../utils/mcp-config.js';

// Get version from package.json
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

/**
 * Doctor command handler
 */
export async function doctor() {
  const targetPath = process.cwd();
  const claudeMdPath = path.join(targetPath, 'CLAUDE.md');

  console.log(chalk.bold('\n🩺 Cortex Health Check\n'));
  console.log(`  Project: ${chalk.cyan(targetPath)}`);
  console.log(`  Package version: ${chalk.cyan(version)}\n`);

  const issues = [];
  const warnings = [];

  // Check 1: CLAUDE.md
  console.log(chalk.bold('  CLAUDE.md'));

  if (await fs.pathExists(claudeMdPath)) {
    const content = await fs.readFile(claudeMdPath, 'utf-8');

    if (hasMarkers(content)) {
      const installedVersion = extractVersion(content);
      console.log(chalk.green(`    ✓ Cortex installed (v${installedVersion})`));

      if (installedVersion !== version) {
        warnings.push(`CLAUDE.md has v${installedVersion}, but package is v${version}`);
        console.log(chalk.yellow(`    ⚠ Version mismatch (package: v${version})`));
      }
    } else {
      issues.push('CLAUDE.md exists but has no Cortex markers');
      console.log(chalk.red('    ✗ No Cortex markers found'));
    }
  } else {
    issues.push('CLAUDE.md not found');
    console.log(chalk.red('    ✗ File not found'));
  }

  // Check 2: Slash commands
  console.log(chalk.bold('\n  Slash Commands'));

  const installed = await getInstalledTemplates(targetPath);
  const available = await getAvailableTemplates();

  if (installed.commands.length > 0) {
    for (const cmd of installed.commands) {
      console.log(chalk.green(`    ✓ ${cmd}`));
    }

    // Check for missing commands
    const missing = available.commands.filter(c => !installed.commands.includes(c));
    for (const cmd of missing) {
      warnings.push(`Missing command: ${cmd}`);
      console.log(chalk.yellow(`    ⚠ Missing: ${cmd}`));
    }
  } else {
    issues.push('No Cortex slash commands found');
    console.log(chalk.red('    ✗ No commands installed'));
  }

  // Check 3: Agent templates
  console.log(chalk.bold('\n  Agent Templates'));

  if (installed.agents.length > 0) {
    for (const agent of installed.agents) {
      console.log(chalk.green(`    ✓ ${agent}`));
    }

    // Check for missing agents
    const missing = available.agents.filter(a => !installed.agents.includes(a));
    for (const agent of missing) {
      warnings.push(`Missing agent: ${agent}`);
      console.log(chalk.yellow(`    ⚠ Missing: ${agent}`));
    }
  } else {
    issues.push('No Cortex agent templates found');
    console.log(chalk.red('    ✗ No agents installed'));
  }

  // Check 4: MCP configuration
  console.log(chalk.bold('\n  MCP Configuration'));
  console.log(chalk.dim(`    Config: ${getConfigPath()}`));

  try {
    if (await hasMcpObsidian()) {
      const config = await getMcpObsidianConfig();
      const vaultPath = config.args?.[config.args.length - 1] || 'unknown';

      console.log(chalk.green('    ✓ MCP Obsidian configured'));
      console.log(chalk.dim(`    Vault: ${vaultPath}`));

      // Check if vault exists
      if (vaultPath !== 'unknown') {
        if (await isObsidianVault(vaultPath)) {
          console.log(chalk.green('    ✓ Vault path valid'));
        } else {
          warnings.push(`Vault path doesn't exist or isn't an Obsidian vault: ${vaultPath}`);
          console.log(chalk.yellow('    ⚠ Vault path may be invalid'));
        }
      }
    } else {
      issues.push('MCP Obsidian not configured');
      console.log(chalk.red('    ✗ Not configured'));
    }
  } catch (error) {
    if (error.code === 'INVALID_CONFIG_JSON') {
      issues.push('~/.claude.json contains invalid JSON');
      console.log(chalk.red('    ✗ Invalid JSON in config file'));
      console.log(chalk.dim(`    ${error.message}`));
    } else {
      throw error;
    }
  }

  // Summary
  console.log(chalk.bold('\n  Summary'));

  if (issues.length === 0 && warnings.length === 0) {
    console.log(chalk.green.bold('    ✓ All checks passed!\n'));
  } else {
    if (issues.length > 0) {
      console.log(chalk.red(`    ✗ ${issues.length} issue(s) found`));
      for (const issue of issues) {
        console.log(chalk.red(`      • ${issue}`));
      }
    }

    if (warnings.length > 0) {
      console.log(chalk.yellow(`    ⚠ ${warnings.length} warning(s)`));
      for (const warning of warnings) {
        console.log(chalk.yellow(`      • ${warning}`));
      }
    }

    console.log('');

    if (issues.length > 0) {
      console.log(chalk.dim('  Run `cortex-ai init` to fix installation issues.'));
    }
    if (warnings.some(w => w.includes('Version'))) {
      console.log(chalk.dim('  Run `cortex-ai upgrade` to update to the latest version.'));
    }
    console.log('');
  }
}
