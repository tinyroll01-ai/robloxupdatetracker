
<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:220px;padding:2rem 0;">
  <p style="font-size:13px;color:var(--color-text-secondary);margin:0 0 8px;letter-spacing:0.05em;text-transform:uppercase;">Current Roblox version</p>
  <p id="version" style="font-size:48px;font-weight:500;color:var(--color-text-primary);margin:0;font-family:var(--font-mono);">—</p>
  <p id="channel" style="font-size:13px;color:var(--color-text-secondary);margin:8px 0 0;"></p>
  <p id="status" style="font-size:12px;color:var(--color-text-tertiary);margin:24px 0 0;"></p>
</div>

<script>
async function fetchVersion() {
  const statusEl = document.getElementById('status');
  const versionEl = document.getElementById('version');
  const channelEl = document.getElementById('channel');
  statusEl.textContent = 'Fetching…';

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        system: 'You are a helper that returns ONLY a JSON object with no extra text. No markdown, no explanation.',
        messages: [{
          role: 'user',
          content: 'Search for the current latest Roblox client version string (e.g. version-xxxxxxxxxxxxxxxx). Return ONLY valid JSON like: {"version":"version-abc123","channel":"LIVE"}'
        }]
      })
    });

    const data = await res.json();
    const text = data.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    const cleaned = text.replace(/```json|```/g, '').trim();
    const json = JSON.parse(cleaned);

    versionEl.textContent = json.version || '—';
    channelEl.textContent = json.channel ? 'Channel: ' + json.channel : '';
    const now = new Date();
    statusEl.textContent = 'Last updated ' + now.toLocaleTimeString();
  } catch (e) {
    statusEl.textContent = 'Error fetching version. Retrying…';
    console.error(e);
  }
}

fetchVersion();
setInterval(fetchVersion, 60000);
</script>
