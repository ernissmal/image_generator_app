const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

/**
 * Service for loading and managing AI prompt templates
 * Validates templates against JSON schema and provides variable substitution
 */
class PromptTemplateLoader {
  /**
   * Initialize the template loader
   * @param {string} templatesDir - Directory containing template files
   */
  constructor(templatesDir) {
    this.templatesDir = templatesDir || path.join(__dirname, '../../prompts/angle-generation');
    this.templates = new Map();
    this.schema = null;
    this.validator = new Ajv({ allErrors: true });
  }

  /**
   * Load JSON schema for validation
   * @returns {Object} JSON schema object
   * @throws {Error} If schema file cannot be loaded
   */
  loadSchema() {
    const schemaPath = path.join(__dirname, '../../prompts/template-schema.json');

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Template schema not found at: ${schemaPath}`);
    }

    try {
      this.schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      return this.schema;
    } catch (error) {
      throw new Error(`Failed to parse schema: ${error.message}`);
    }
  }

  /**
   * Load all templates from directory
   * @returns {Map} Map of template IDs to template objects
   * @throws {Error} If templates directory doesn't exist or templates fail validation
   */
  loadAll() {
    if (!this.schema) {
      this.loadSchema();
    }

    if (!fs.existsSync(this.templatesDir)) {
      throw new Error(`Templates directory not found: ${this.templatesDir}`);
    }

    const files = fs.readdirSync(this.templatesDir)
      .filter(f => f.endsWith('.json'));

    if (files.length === 0) {
      throw new Error(`No template files found in: ${this.templatesDir}`);
    }

    let loadedCount = 0;
    let errors = [];

    files.forEach(file => {
      try {
        const templateId = path.basename(file, '.json');
        const template = this.load(templateId);
        if (template) {
          this.templates.set(template.id, template);
          loadedCount++;
        }
      } catch (error) {
        errors.push(`${file}: ${error.message}`);
      }
    });

    if (errors.length > 0) {
      console.warn(`⚠️  Some templates failed to load:\n${errors.join('\n')}`);
    }

    console.log(`✅ Loaded ${loadedCount} prompt templates`);
    return this.templates;
  }

  /**
   * Load single template by filename (without .json extension)
   * @param {string} templateId - Template filename without extension
   * @returns {Object} Template object
   * @throws {Error} If template not found or validation fails
   */
  load(templateId) {
    const filePath = path.join(this.templatesDir, `${templateId}.json`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Template not found: ${templateId}`);
    }

    let template;
    try {
      template = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      throw new Error(`Failed to parse template ${templateId}: ${error.message}`);
    }

    // Validate against schema if schema is loaded
    if (this.schema) {
      const validate = this.validator.compile(this.schema);
      const valid = validate(template);

      if (!valid) {
        const errorMsg = validate.errors.map(e =>
          `${e.instancePath || 'root'}: ${e.message}`
        ).join(', ');
        throw new Error(`Invalid template ${templateId}: ${errorMsg}`);
      }
    }

    return template;
  }

  /**
   * Get template by angle type
   * @param {string} angleType - Angle type (e.g., '0deg', 'isometric')
   * @returns {Object} Template object
   * @throws {Error} If no template found for angle type
   */
  getByAngleType(angleType) {
    const template = Array.from(this.templates.values())
      .find(t => t.angle_type === angleType);

    if (!template) {
      throw new Error(`No template found for angle type: ${angleType}`);
    }

    return template;
  }

  /**
   * Get template by ID
   * @param {string} id - Template ID
   * @returns {Object} Template object
   * @throws {Error} If template not found
   */
  getById(id) {
    const template = this.templates.get(id);

    if (!template) {
      throw new Error(`No template found with ID: ${id}`);
    }

    return template;
  }

  /**
   * Substitute variables in prompt text
   * @param {Object} template - Template object
   * @param {Object} variables - Key-value pairs for substitution
   * @returns {Object} Prompt object with substituted values
   * @example
   * substitute(template, { product_name: 'Leather Wallet' })
   * // Returns: { system: '...', user: 'Product: Leather Wallet...', negative: '...', parameters: {...} }
   */
  substitute(template, variables = {}) {
    let userPrompt = template.prompt.user;

    // Replace all {variable} placeholders
    Object.keys(variables).forEach(key => {
      const placeholder = `{${key}}`;
      const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
      userPrompt = userPrompt.replace(regex, variables[key]);
    });

    // Check for unsubstituted variables
    const unsubstituted = userPrompt.match(/\{[^}]+\}/g);
    if (unsubstituted) {
      console.warn(`⚠️  Unsubstituted variables in template: ${unsubstituted.join(', ')}`);
    }

    return {
      system: template.prompt.system,
      user: userPrompt,
      negative: template.prompt.negative,
      parameters: template.parameters
    };
  }

  /**
   * Get all available angle types with metadata
   * @returns {Array} Array of angle type objects
   */
  getAvailableAngles() {
    return Array.from(this.templates.values()).map(t => ({
      id: t.id,
      type: t.angle_type,
      description: t.description,
      version: t.version
    }));
  }

  /**
   * Get statistics about loaded templates
   * @returns {Object} Template statistics
   */
  getStats() {
    return {
      total: this.templates.size,
      angleTypes: [...new Set(Array.from(this.templates.values()).map(t => t.angle_type))],
      versions: [...new Set(Array.from(this.templates.values()).map(t => t.version))]
    };
  }

  /**
   * Format prompt for Gemini API
   * Combines system and user prompts into a single format
   * @param {Object} substitutedPrompt - Result from substitute()
   * @param {string} productName - Product name for context
   * @returns {string} Formatted prompt string
   */
  formatForAPI(substitutedPrompt, productName) {
    const parts = [];

    // Add system context
    if (substitutedPrompt.system) {
      parts.push(`System Context: ${substitutedPrompt.system}`);
      parts.push('');
    }

    // Add main prompt
    parts.push(substitutedPrompt.user);

    // Add negative prompts
    if (substitutedPrompt.negative) {
      parts.push('');
      parts.push(`IMPORTANT - Avoid: ${substitutedPrompt.negative}`);
    }

    return parts.join('\n');
  }
}

module.exports = PromptTemplateLoader;
