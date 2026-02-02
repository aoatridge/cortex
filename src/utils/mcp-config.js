/**
 * MCP configuration utilities
 *
 * Manages ~/.claude.json and MCP server configuration.
 */

import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const CLAUDE_CONFIG_PATH = path.join(os.homedir(), '.claude.json');

// Common Obsidian vault locations to check
const COMMON_VAULT_PATHS = [
  path.join(os.homedir(), 'obsidian'),
  path.join(os.homedir(), 'Obsidian'),
  path.join(os.homedir(), 'Documents', 'Obsidian'),
  path.join(os.homedir(), 'Documents', 'obsidian'),
  path.join(os.homedir(), 'notes'),
  path.join(os.homedir(), 'Notes'),
];

/**
 * Read the Claude config file
 * @returns {Promise<object>}
 * @throws {Error} If the config file exists but contains invalid JSON
 */
export async function readClaudeConfig() {
  if (await fs.pathExists(CLAUDE_CONFIG_PATH)) {
    const content = await fs.readFile(CLAUDE_CONFIG_PATH, 'utf-8');
    try {
      return JSON.parse(content);
    } catch (err) {
      const error = new Error(
        `Invalid JSON in ${CLAUDE_CONFIG_PATH}: ${err.message}\n` +
        `Please fix the file manually or remove it to start fresh.`
      );
      error.code = 'INVALID_CONFIG_JSON';
      throw error;
    }
  }
  return {};
}

/**
 * Create a timestamped backup of the Claude config file
 * @returns {Promise<string|null>} - Backup path if created, null if no file to backup
 */
export async function backupClaudeConfig() {
  if (!await fs.pathExists(CLAUDE_CONFIG_PATH)) {
    return null;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${CLAUDE_CONFIG_PATH}.backup-${timestamp}`;

  await fs.copy(CLAUDE_CONFIG_PATH, backupPath);
  return backupPath;
}

/**
 * Write the Claude config file (creates backup first)
 * @param {object} config - Configuration object
 * @returns {Promise<string|null>} - Backup path if created
 */
export async function writeClaudeConfig(config) {
  // Create backup before modifying
  const backupPath = await backupClaudeConfig();

  await fs.writeFile(
    CLAUDE_CONFIG_PATH,
    JSON.stringify(config, null, 2) + '\n',
    'utf-8'
  );

  return backupPath;
}

/**
 * Check if MCP obsidian server is already configured
 * @returns {Promise<boolean>}
 */
export async function hasMcpObsidian() {
  const config = await readClaudeConfig();
  return !!(config.mcpServers?.obsidian);
}

/**
 * Get the current MCP obsidian configuration
 * @returns {Promise<object|null>}
 */
export async function getMcpObsidianConfig() {
  const config = await readClaudeConfig();
  return config.mcpServers?.obsidian || null;
}

/**
 * Add or update MCP obsidian configuration
 * @param {string} vaultPath - Path to Obsidian vault
 * @returns {Promise<string|null>} - Backup path if created
 */
export async function configureMcpObsidian(vaultPath) {
  const config = await readClaudeConfig();

  if (!config.mcpServers) {
    config.mcpServers = {};
  }

  config.mcpServers.obsidian = {
    command: 'npx',
    args: ['-y', 'github:aoatridge/mcp-obsidian', vaultPath]
  };

  return await writeClaudeConfig(config);
}

/**
 * Remove MCP obsidian configuration
 * @returns {Promise<{removed: boolean, backupPath: string|null}>}
 */
export async function removeMcpObsidian() {
  const config = await readClaudeConfig();

  if (config.mcpServers?.obsidian) {
    delete config.mcpServers.obsidian;

    // Clean up empty mcpServers object
    if (Object.keys(config.mcpServers).length === 0) {
      delete config.mcpServers;
    }

    const backupPath = await writeClaudeConfig(config);
    return { removed: true, backupPath };
  }

  return { removed: false, backupPath: null };
}

/**
 * Try to detect an Obsidian vault on the system
 * @returns {Promise<string[]>} - List of found vault paths
 */
export async function detectObsidianVaults() {
  const found = [];

  for (const vaultPath of COMMON_VAULT_PATHS) {
    if (await fs.pathExists(vaultPath)) {
      // Check if it looks like an Obsidian vault (has .obsidian folder)
      const obsidianDir = path.join(vaultPath, '.obsidian');
      if (await fs.pathExists(obsidianDir)) {
        found.push(vaultPath);
      } else {
        // Check subdirectories
        try {
          const subdirs = await fs.readdir(vaultPath, { withFileTypes: true });
          for (const dirent of subdirs) {
            if (dirent.isDirectory()) {
              const subVaultDir = path.join(vaultPath, dirent.name, '.obsidian');
              if (await fs.pathExists(subVaultDir)) {
                found.push(path.join(vaultPath, dirent.name));
              }
            }
          }
        } catch {
          // Ignore permission errors
        }
      }
    }
  }

  return found;
}

/**
 * Validate that a path is an Obsidian vault
 * @param {string} vaultPath - Path to check
 * @returns {Promise<boolean>}
 */
export async function isObsidianVault(vaultPath) {
  const obsidianDir = path.join(vaultPath, '.obsidian');
  return fs.pathExists(obsidianDir);
}

/**
 * Get the config file path
 * @returns {string}
 */
export function getConfigPath() {
  return CLAUDE_CONFIG_PATH;
}
