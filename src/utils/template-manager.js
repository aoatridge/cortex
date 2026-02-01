/**
 * Template management utilities
 *
 * Handles copying templates to projects and managing file operations.
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Templates are in the package's templates/ directory
const TEMPLATES_DIR = path.resolve(__dirname, '../../templates');

/**
 * Get the path to the templates directory
 * @returns {string}
 */
export function getTemplatesDir() {
  return TEMPLATES_DIR;
}

/**
 * Read the main CLAUDE.md template
 * @returns {Promise<string>}
 */
export async function readClaudeMdTemplate() {
  const templatePath = path.join(TEMPLATES_DIR, 'CLAUDE.md');
  return fs.readFile(templatePath, 'utf-8');
}

/**
 * Copy agent templates to project
 * @param {string} projectPath - Target project path
 * @returns {Promise<string[]>} - List of copied files
 */
export async function copyAgentTemplates(projectPath) {
  const sourceDir = path.join(TEMPLATES_DIR, 'agents');
  const targetDir = path.join(projectPath, '.claude', 'agents');

  await fs.ensureDir(targetDir);

  const files = await fs.readdir(sourceDir);
  const copied = [];

  for (const file of files) {
    if (file.endsWith('.md')) {
      await fs.copy(
        path.join(sourceDir, file),
        path.join(targetDir, file)
      );
      copied.push(file);
    }
  }

  return copied;
}

/**
 * Copy command templates to project
 * @param {string} projectPath - Target project path
 * @returns {Promise<string[]>} - List of copied files
 */
export async function copyCommandTemplates(projectPath) {
  const sourceDir = path.join(TEMPLATES_DIR, 'commands');
  const targetDir = path.join(projectPath, '.claude', 'commands');

  await fs.ensureDir(targetDir);

  const files = await fs.readdir(sourceDir);
  const copied = [];

  for (const file of files) {
    if (file.endsWith('.md')) {
      await fs.copy(
        path.join(sourceDir, file),
        path.join(targetDir, file)
      );
      copied.push(file);
    }
  }

  return copied;
}

/**
 * Remove Cortex agent templates from project
 * @param {string} projectPath - Target project path
 * @returns {Promise<string[]>} - List of removed files
 */
export async function removeAgentTemplates(projectPath) {
  const targetDir = path.join(projectPath, '.claude', 'agents');
  const removed = [];

  if (await fs.pathExists(targetDir)) {
    const files = await fs.readdir(targetDir);
    for (const file of files) {
      if (file.startsWith('cortex-') && file.endsWith('.md')) {
        await fs.remove(path.join(targetDir, file));
        removed.push(file);
      }
    }

    // Remove directory if empty
    const remaining = await fs.readdir(targetDir);
    if (remaining.length === 0) {
      await fs.remove(targetDir);
    }
  }

  return removed;
}

/**
 * Remove Cortex command templates from project
 * @param {string} projectPath - Target project path
 * @returns {Promise<string[]>} - List of removed files
 */
export async function removeCommandTemplates(projectPath) {
  const targetDir = path.join(projectPath, '.claude', 'commands');
  const removed = [];

  if (await fs.pathExists(targetDir)) {
    const files = await fs.readdir(targetDir);
    for (const file of files) {
      if (file.startsWith('cortex-') && file.endsWith('.md')) {
        await fs.remove(path.join(targetDir, file));
        removed.push(file);
      }
    }

    // Remove directory if empty
    const remaining = await fs.readdir(targetDir);
    if (remaining.length === 0) {
      await fs.remove(targetDir);
    }
  }

  return removed;
}

/**
 * Check if a project has Cortex templates installed
 * @param {string} projectPath - Project path
 * @returns {Promise<{agents: string[], commands: string[]}>}
 */
export async function getInstalledTemplates(projectPath) {
  const result = { agents: [], commands: [] };

  const agentsDir = path.join(projectPath, '.claude', 'agents');
  const commandsDir = path.join(projectPath, '.claude', 'commands');

  if (await fs.pathExists(agentsDir)) {
    const files = await fs.readdir(agentsDir);
    result.agents = files.filter(f => f.startsWith('cortex-') && f.endsWith('.md'));
  }

  if (await fs.pathExists(commandsDir)) {
    const files = await fs.readdir(commandsDir);
    result.commands = files.filter(f => f.startsWith('cortex-') && f.endsWith('.md'));
  }

  return result;
}

/**
 * Get the list of available templates
 * @returns {Promise<{agents: string[], commands: string[]}>}
 */
export async function getAvailableTemplates() {
  const agentsDir = path.join(TEMPLATES_DIR, 'agents');
  const commandsDir = path.join(TEMPLATES_DIR, 'commands');

  const agents = (await fs.readdir(agentsDir)).filter(f => f.endsWith('.md'));
  const commands = (await fs.readdir(commandsDir)).filter(f => f.endsWith('.md'));

  return { agents, commands };
}
