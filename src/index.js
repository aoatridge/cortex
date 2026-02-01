/**
 * Cortex AI - Graph-based AI memory using Obsidian
 *
 * Main entry point for programmatic usage.
 */

export { init } from './commands/init.js';
export { uninstall } from './commands/uninstall.js';
export { upgrade } from './commands/upgrade.js';
export { mcpSetup } from './commands/mcp-setup.js';
export { doctor } from './commands/doctor.js';

export * from './utils/markers.js';
export * from './utils/template-manager.js';
export * from './utils/mcp-config.js';
