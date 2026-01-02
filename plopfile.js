module.exports = function (plop) {
  // Helper to ensure trailing slash is not duplicated
  plop.setHelper('trimSlash', function (text) {
    const t = (text || '').toString()
    return t.replace(/\/+$/, '')
  })

  plop.setGenerator('email', {
    description: 'Generate a new email template with EmailBody and wrapper',
    prompts: [
      {
        type: 'input',
        name: 'componentName',
        message:
          'Enter Email Context (<context> <action>) e.g. offer update, order placed, offer rejected:',
        validate: (v) => (v && /\w+/.test(v) ? true : 'Please enter a name'),
      },
      {
        type: 'list',
        name: 'domain',
        message: 'Domain/folder under emails/:',
        choices: [
          'general',
          'custom'
        ],
        default: 'general',
      },
      {
        type: 'input',
        name: 'customDomain',
        message: 'Enter custom domain (folder name):',
        when: (ans) => ans.domain === 'custom',
        validate: (v) => (v && /[a-z0-9\-_/]+/i.test(v) ? true : 'Enter a valid folder name'),
      },
      {
        type: 'input',
        name: 'previewText',
        message: 'Preview text shown in email clients:',
        default: (ans) => ans.componentName,
      },
      {
        type: 'input',
        name: 'buttonPath',
        message:
          'Path appended to baseUrl for CTA button (without domain name to use default). Example: /account/negotiations',
        default: (ans) => `/account/${ans.domain === 'custom' ? '{{customDomain}}' : ans.domain}`,
      },
    ],
    actions: (data) => {
      const actions = []
      const folder = (data.domain === 'custom' ? data.customDomain : data.domain) || 'misc'
      // Expose computed folder to Handlebars templates so helpers like kebabCase
      // receive a defined string value. Otherwise plop's kebabCase may crash
      // when called with undefined.
      data.folder = folder
      actions.push({
        type: 'add',
        path: 'emails/{{kebabCase folder}}/{{kebabCase componentName}}.tsx',
        templateFile: 'plop-templates/email.hbs',
        abortOnFail: true,
      })
      return actions
    },
  })
}
