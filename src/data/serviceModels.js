/**
 * Single source of truth for the layers, service models and answer key.
 * To change the key, edit a model's `youLayers` number.
 * @module data/serviceModels
 */

/**
 * @typedef {'you' | 'provider'} Owner
 * @typedef {{ id: string, label: string }} Layer
 * @typedef {{
 *   id: string,
 *   title: string,
 *   subtitle: string,
 *   youLayers: number,
 *   explanation: string,
 *   examples: string
 * }} ServiceModel
 */

/** @type {Layer[]} Layers in display order, top to bottom. */
export const LAYERS = [
  { id: 'data', label: 'Data & access' },
  { id: 'applications', label: 'Applications' },
  { id: 'runtime', label: 'Runtime' },
  { id: 'os', label: 'Operating system' },
  { id: 'vm', label: 'Virtual machine' },
  { id: 'compute', label: 'Compute' },
  { id: 'networking', label: 'Networking' },
  { id: 'storage', label: 'Storage' },
]

/** @type {ServiceModel[]} Columns in display order, left to right. */
export const MODELS = [
  {
    id: 'onprem',
    title: 'On-premises',
    subtitle: 'Private cloud',
    youLayers: 8,
    explanation:
      'Everything sits in your own building, so your team looks after every layer, from the hardware up to the data.',
    examples: 'A college server room, a company data centre.',
  },
  {
    id: 'iaas',
    title: 'Infrastructure',
    subtitle: 'as a service',
    youLayers: 5,
    explanation:
      'The provider supplies the physical servers, storage and network. You look after the virtual machine, the operating system and everything above it.',
    examples: 'Amazon EC2, Azure Virtual Machines.',
  },
  {
    id: 'paas',
    title: 'Platform',
    subtitle: 'as a service',
    youLayers: 2,
    explanation:
      'The provider also runs the virtual machines, operating system and runtime. You deploy your own application and manage your data.',
    examples: 'Azure App Service, Heroku.',
  },
  {
    id: 'saas',
    title: 'Software',
    subtitle: 'as a service',
    youLayers: 1,
    explanation:
      'You only look after your own data and who can get at it. The provider runs the application and everything beneath it.',
    examples: 'Microsoft 365, Google Workspace.',
  },
]

/**
 * Derive the correct owner of a layer in a model.
 * @param {ServiceModel} model
 * @param {number} layerIndex Zero-based index into LAYERS.
 * @returns {Owner}
 */
export function correctOwner(model, layerIndex) {
  return layerIndex < model.youLayers ? 'you' : 'provider'
}