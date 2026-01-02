import { templates } from './emails/index'

export function getIndexHtml() {
  const availableTemplates = Object.entries(templates)
    .map(([moduleName, moduleTemplates]) => {
      const templateList = Object.keys(moduleTemplates)
        .map((t) => `<li><code>${t}</code></li>`)
        .join('')
      return `<h3>${moduleName}</h3><ul>${templateList}</ul>`
    })
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Email Template API</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 2rem; background-color: #f4f7f6; }
        h1 { color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
        h2 { margin-top: 2rem; color: #4a5568; }
        h3 { color: #718096; text-transform: uppercase; font-size: 0.875rem; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        code { background: #edf2f7; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 0.875rem; }
        pre { background: #1a202c; color: #fff; padding: 1.25rem; border-radius: 8px; overflow-x: auto; font-size: 0.875rem; line-height: 1.5; }
        .endpoint { margin-bottom: 1rem; padding: 1rem; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .method { font-weight: bold; color: #3182ce; margin-right: 0.5rem; }
        .path { font-family: monospace; font-weight: bold; color: #2d3748; }
        .footer { margin-top: 4rem; font-size: 0.875rem; color: #a0aec0; border-top: 1px solid #e2e8f0; padding-top: 1rem; text-align: center; }
        a { color: #3182ce; text-decoration: none; }
        a:hover { text-decoration: underline; }
        ul { list-style-type: none; padding-left: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
        li { margin-bottom: 0.5rem; }
    </style>
</head>
<body>
    <h1>📧 Email Template API</h1>
    <p>A professional service for rendering React-based email templates to HTML and Text.</p>

    <h2>🚀 API Endpoints</h2>
    
    <div class="endpoint">
        <p><span class="method">POST</span> <span class="path">/api/render</span></p>
        <p>Returns JSON: <code>{ "html": "...", "text": "..." }</code></p>
    </div>

    <div class="endpoint">
        <p><span class="method">POST</span> <span class="path">/api/render/html</span></p>
        <p>Returns raw HTML body.</p>
    </div>

    <div class="endpoint">
        <p><span class="method">POST</span> <span class="path">/api/render/text</span></p>
        <p>Returns plain text body.</p>
    </div>

    <h2>📂 Sample Templates</h2>
    ${availableTemplates}

    <h2>📦 Payload Example</h2>
    <pre>{
  "emailModule": "general",
  "template": "christmas",
  "variables": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}</pre>

    <h2>🔗 Resources</h2>
    <p>
        <a href="https://github.com/Kristofajosh/react-email-template-bootstrap" target="_blank">Documentation & Repository</a> •
        <a href="/health">Health Check</a>
    </p>

    <div class="footer">
        Built with React Email Template Bootstrap
    </div>
</body>
</html>
  `
}
