/**
 * Marker-based content management for CLAUDE.md
 *
 * Uses HTML comments to wrap Cortex content, allowing safe
 * append/remove without parsing or modifying user content.
 */

const START_MARKER = '<!-- CORTEX:START';
const END_MARKER = '<!-- CORTEX:END -->';

/**
 * Check if content already has Cortex markers
 * @param {string} content - File content
 * @returns {boolean}
 */
export function hasMarkers(content) {
  return content.includes(START_MARKER) && content.includes(END_MARKER);
}

/**
 * Extract version from existing Cortex installation
 * @param {string} content - File content
 * @returns {string|null} - Version string or null if not found
 */
export function extractVersion(content) {
  const match = content.match(/<!-- CORTEX:START version="([^"]+)"/);
  return match ? match[1] : null;
}

/**
 * Extract installation date from existing Cortex installation
 * @param {string} content - File content
 * @returns {string|null} - Date string or null if not found
 */
export function extractInstallDate(content) {
  const match = content.match(/installed="([^"]+)"/);
  return match ? match[1] : null;
}

/**
 * Create the start marker with metadata
 * @param {string} version - Cortex version
 * @returns {string}
 */
function createStartMarker(version) {
  const date = new Date().toISOString().split('T')[0];
  return `<!-- CORTEX:START version="${version}" installed="${date}" -->`;
}

/**
 * Append Cortex content to existing file content
 * @param {string} existingContent - Current file content
 * @param {string} cortexContent - Cortex template content
 * @param {string} version - Cortex version
 * @returns {string} - Combined content
 */
export function appendWithMarkers(existingContent, cortexContent, version) {
  const startMarker = createStartMarker(version);

  // Ensure proper spacing
  const separator = existingContent.trim() ? '\n\n---\n\n' : '';

  return `${existingContent.trimEnd()}${separator}${startMarker}
${cortexContent.trim()}
${END_MARKER}
`;
}

/**
 * Create new file with Cortex content wrapped in markers
 * @param {string} cortexContent - Cortex template content
 * @param {string} version - Cortex version
 * @returns {string}
 */
export function createWithMarkers(cortexContent, version) {
  const startMarker = createStartMarker(version);

  return `${startMarker}
${cortexContent.trim()}
${END_MARKER}
`;
}

/**
 * Remove Cortex content from file
 * @param {string} content - File content
 * @returns {string} - Content with Cortex section removed
 */
export function removeMarkers(content) {
  // Match from separator (if present) through end marker
  // The separator is: \n\n---\n\n before the marker
  const pattern = /(\n\n---\n\n)?<!-- CORTEX:START[^>]*>[\s\S]*?<!-- CORTEX:END -->\n?/;
  return content.replace(pattern, '').trimEnd() + '\n';
}

/**
 * Replace existing Cortex content with new content
 * @param {string} content - File content
 * @param {string} newCortexContent - New Cortex template content
 * @param {string} version - New version
 * @returns {string}
 */
export function replaceMarkers(content, newCortexContent, version) {
  const withoutCortex = removeMarkers(content);
  return appendWithMarkers(withoutCortex, newCortexContent, version);
}

/**
 * Extract the Cortex section from content
 * @param {string} content - File content
 * @returns {string|null} - Cortex content or null if not found
 */
export function extractCortexSection(content) {
  const match = content.match(/<!-- CORTEX:START[^>]*>([\s\S]*?)<!-- CORTEX:END -->/);
  return match ? match[1].trim() : null;
}
