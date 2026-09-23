/**
 * RVPU Front-End Dashboard Client
 * Reads normalized telemetry & leads from local server.
 */
async function fetchDashboardData() {
  try {
    // 1. Fetch Stats
    const statsRes = await fetch('/api/dashboard/stats');
    const stats = await statsRes.json();
    document.getElementById('kpi-conversations').textContent = stats.totalConversations;
    document.getElementById('kpi-leads').textContent = stats.totalLeads;
    document.getElementById('kpi-accuracy').textContent = stats.intentAccuracy;
    document.getElementById('kpi-speed').textContent = stats.avgResponseTime;

    // 2. Fetch Leads (Normalized: timestamp & data)
    const leadsRes = await fetch('/api/dashboard/leads');
    const leads = await leadsRes.json();
    renderLeads(leads);

    // 3. Fetch Interactions (Normalized: timestamp & data)
    const logsRes = await fetch('/api/dashboard/interactions');
    const logs = await logsRes.json();
    renderInteractions(logs);
  } catch (err) {
    console.error('Error refreshing dashboard data:', err);
  }
}

function renderLeads(leads) {
  const tbody = document.getElementById('leads-tbody');
  const countEl = document.getElementById('leads-count');
  countEl.textContent = leads.length + ' Leads';
  tbody.innerHTML = '';

  leads.forEach(item => {
    const d = item.data || {};
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${d.name || 'Anonymous Applicant'}</strong></td>
      <td>${d.phone || '-'}</td>
      <td>${d.email || '-'}</td>
      <td><span style="color: #60A5FA;">${d.stream || 'General'}</span></td>
      <td><span class="status-badge-verified">${d.status || 'Verified'}</span></td>
      <td style="color: #9CA3AF; font-size: 11.5px;">${formatTime(item.timestamp)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderInteractions(logs) {
  const container = document.getElementById('interactions-feed');
  container.innerHTML = '';

  logs.slice(0, 10).forEach(item => {
    const d = item.data || {};
    const div = document.createElement('div');
    div.className = 'feed-item';
    div.innerHTML = `
      <div class="feed-top">
        <span style="color: #10B981; font-weight: 700;">Intent: ${d.intent || 'telemetry'}</span>
        <span class="feed-meta">${formatTime(item.timestamp)}</span>
      </div>
      <div class="feed-query">${d.query || (d.event ? 'Event: ' + d.event : 'Conversation')}</div>
    `;
    container.appendChild(div);
  });
}

function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function exportLeads() {
  window.open('/api/dashboard/leads', '_blank');
}

// Auto init & 15s refresh
document.addEventListener('DOMContentLoaded', () => {
  fetchDashboardData();
  setInterval(fetchDashboardData, 15000);
});
