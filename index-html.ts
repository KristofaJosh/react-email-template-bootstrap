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

  const templatesJson = JSON.stringify(
    Object.fromEntries(
      Object.entries(templates).map(([moduleName, moduleTemplates]) => [
        moduleName,
        Object.fromEntries(
          Object.entries(moduleTemplates).map(([templateName, templateEntry]) => [
            templateName,
            (templateEntry as any).variables,
          ])
        ),
      ])
    )
  )

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Email Template API</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 1000px; margin: 0 auto; padding: 2rem; background-color: #f4f7f6; }
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

        /* Playground styles */
        .playground { display: grid; grid-template-columns: 350px 1fr; gap: 2rem; background: #fff; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        @media (max-width: 800px) { .playground { grid-template-columns: 1fr; } }
        .playground-form { display: flex; flex-direction: column; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-weight: 600; font-size: 0.875rem; color: #4a5568; }
        select, textarea { padding: 0.6rem; border: 1px solid #cbd5e0; border-radius: 6px; font-family: inherit; font-size: 0.9rem; }
        textarea { font-family: 'SFMono-Regular', Consolas, monospace; min-height: 150px; resize: vertical; }
        button#render-btn { background: #3182ce; color: #fff; border: none; padding: 0.75rem; border-radius: 6px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
        button#render-btn:hover { background: #2b6cb0; }
        button#render-btn:disabled { background: #a0aec0; cursor: not-allowed; }

        .playground-output { display: flex; flex-direction: column; height: 100%; min-height: 500px; }
        .tabs { display: flex; border-bottom: 1px solid #e2e8f0; margin-bottom: 1rem; }
        .tab { padding: 0.5rem 1rem; cursor: pointer; border-bottom: 2px solid transparent; font-size: 0.875rem; font-weight: 500; color: #718096; }
        .tab.active { border-bottom-color: #3182ce; color: #3182ce; }
        .tab-content { display: none; flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; background: #fff; }
        .tab-content.active { display: block; }
        iframe { width: 100%; height: 100%; border: none; background: #fff; }
        .text-output { white-space: pre-wrap; padding: 1rem; margin: 0; background: #f8fafc; font-family: 'SFMono-Regular', Consolas, monospace; font-size: 0.875rem; height: 100%; overflow-y: auto; color: #2d3748; }
    </style>
</head>
<body>
    <h1>📧 Email Template API</h1>
    <p>A service for rendering React-based email templates to HTML and Text.</p>
    <p><strong>Tip:</strong> Prefer setting this up in a serverless environment for better scalability and cost management.</p>

    <div style="background: #ebf8ff; border-left: 4px solid #3182ce; padding: 1rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0;">
        <h3 style="margin-top: 0; color: #2b6cb0;">🏛 Architecture: Design vs. Triggering</h3>
        <p style="margin-bottom: 0;">This service decouples <strong>Design</strong> (Frontend/React) from <strong>Triggering</strong> (Backend/Business Logic). The backend only needs to call this API with variables, while the designs are managed independently in this repository.</p>
    </div>

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

    <h2>🧪 Live Playground</h2>
    <div class="playground">
        <div class="playground-form">
            <div class="form-group">
                <label for="module-select">Email Module</label>
                <select id="module-select"></select>
            </div>
            <div class="form-group">
                <label for="template-select">Template</label>
                <select id="template-select"></select>
            </div>
            <div class="form-group">
                <label for="variables-input">Variables (JSON)</label>
                <textarea id="variables-input" placeholder='{ "name": "John Doe" }'></textarea>
            </div>
            <button id="render-btn">Render Template</button>
        </div>
        <div class="playground-output">
            <div class="tabs">
                <div class="tab active" data-tab="preview">Preview</div>
                <div class="tab" data-tab="html">HTML</div>
                <div class="tab" data-tab="text">Text</div>
            </div>
            <div id="tab-preview" class="tab-content active">
                <iframe id="preview-iframe"></iframe>
            </div>
            <div id="tab-html" class="tab-content">
                <pre class="text-output" id="html-output"></pre>
            </div>
            <div id="tab-text" class="tab-content">
                <pre class="text-output" id="text-output"></pre>
            </div>
        </div>
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

    <script>
        const templates = ${templatesJson};
        const moduleSelect = document.getElementById('module-select');
        const templateSelect = document.getElementById('template-select');
        const variablesInput = document.getElementById('variables-input');
        const renderBtn = document.getElementById('render-btn');
        const previewIframe = document.getElementById('preview-iframe');
        const htmlOutput = document.getElementById('html-output');
        const textOutput = document.getElementById('text-output');

        // Initialize modules
        Object.keys(templates).forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            moduleSelect.appendChild(opt);
        });

        function updateTemplates() {
            const m = moduleSelect.value;
            templateSelect.innerHTML = '';
            Object.keys(templates[m]).forEach(t => {
                const opt = document.createElement('option');
                opt.value = t;
                opt.textContent = t;
                templateSelect.appendChild(opt);
            });
            updateVariables();
        }

        function updateVariables() {
            const m = moduleSelect.value;
            const t = templateSelect.value;
            const vars = templates[m][t] || {};
            variablesInput.value = JSON.stringify(vars, null, 2);
        }

        moduleSelect.addEventListener('change', updateTemplates);
        templateSelect.addEventListener('change', updateVariables);
        updateTemplates();

        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
            });
        });

        renderBtn.addEventListener('click', async () => {
            renderBtn.disabled = true;
            renderBtn.textContent = 'Rendering...';
            
            try {
                const payload = {
                    emailModule: moduleSelect.value,
                    template: templateSelect.value,
                    variables: JSON.parse(variablesInput.value || '{}')
                };

                const res = await fetch('/api/render', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                
                if (res.ok) {
                    // Update iframe
                    const doc = previewIframe.contentDocument || previewIframe.contentWindow.document;
                    doc.open();
                    doc.write(data.html);
                    doc.close();

                    htmlOutput.textContent = data.html;
                    textOutput.textContent = data.text;
                } else {
                    alert('Error: ' + (data.error || 'Failed to render'));
                }
            } catch (err) {
                alert('Error: ' + err.message);
            } finally {
                renderBtn.disabled = false;
                renderBtn.textContent = 'Render Template';
            }
        });
    </script>
</body>
</html>
  `
}
