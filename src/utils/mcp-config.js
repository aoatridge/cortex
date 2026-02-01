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
 */
export async function readClaudeConfig() {
  if (await fs.pathExists(CLAUDE_CONFIG_PATH)) {
    const content = await fs.readFile(CLAUDE_CONFIG_PATH, 'utf-8');
    try {
      return JSON.parse(content);
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * Write the Claude config file
 * @param {object} config - Configuration object
 */
export async function writeClaudeConfig(config) {
  await fs.writeFile(
    CLAUDE_CONFIG_PATH,
    JSON.stringify(config, null, 2) + '\n',
    'utf-8'
  );
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
 * @returns {Promise<void>}
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

  await writeClaudeConfig(config);
}

/**
 * Remove MCP obsidian configuration
 * @returns {Promise<boolean>} - True if removed, false if wasn't present
 */
export async function removeMcpObsidian() {
  const config = await readClaudeConfig();

  if (config.mcpServers?.obsidian) {
    delete config.mcpServers.obsidian;

    // Clean up empty mcpServers object
    if (Object.keys(config.mcpServers).length === 0) {
      delete config.mcpServers;
    }

    await writeClaudeConfig(config);
    return true;
  }

  return false;
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
