/**
 * Utilitários para exportação de relatórios em PDF e Excel
 */

// Exportar para CSV (compatível com Excel)
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    alert('Nenhum dado para exportar');
    return;
  }

  // Obter headers
  const headers = Object.keys(data[0]);
  
  // Criar CSV
  let csv = headers.join(',') + '\n';
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Escapar aspas e quebras de linha
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csv += values.join(',') + '\n';
  });

  // Criar blob e download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Exportar para JSON
export const exportToJSON = (data: any[], filename: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Exportar para HTML (para depois converter em PDF)
export const exportToHTML = (content: string, filename: string) => {
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      color: #333;
      line-height: 1.6;
    }
    h1, h2, h3 {
      color: #1e40af;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .metric {
      display: inline-block;
      margin: 10px 20px 10px 0;
      padding: 15px;
      background-color: #f0f9ff;
      border-left: 4px solid #1e40af;
      border-radius: 4px;
    }
    .metric-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #1e40af;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  ${content}
  <div class="footer">
    <p>Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
    <p>Sistema de Gestão de Lojas Maçônicas</p>
  </div>
</body>
</html>
  `;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.html`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Exportar Dashboard Executivo como HTML/PDF
export const exportDashboardReport = (stats: any, filename: string = 'dashboard-executivo') => {
  const html = `
    <h1>Dashboard Executivo - Relatório Completo</h1>
    <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
    
    <h2>Indicadores-Chave (KPIs)</h2>
    <div>
      <div class="metric">
        <div class="metric-label">Total de Membros</div>
        <div class="metric-value">${stats.totalMembers || 0}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Membros Ativos</div>
        <div class="metric-value">${stats.activeMembers || 0}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Receita Mensal</div>
        <div class="metric-value">R$ ${(stats.monthlyRevenue || 0).toLocaleString('pt-BR')}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Taxa de Conformidade</div>
        <div class="metric-value">${(stats.complianceRate || 0).toFixed(1)}%</div>
      </div>
    </div>

    <h2>Resumo Executivo</h2>
    <table>
      <tr>
        <th>Métrica</th>
        <th>Valor</th>
      </tr>
      <tr>
        <td>Total de Membros</td>
        <td>${stats.totalMembers || 0}</td>
      </tr>
      <tr>
        <td>Membros Ativos</td>
        <td>${stats.activeMembers || 0}</td>
      </tr>
      <tr>
        <td>Taxa de Atividade</td>
        <td>${stats.totalMembers > 0 ? ((stats.activeMembers / stats.totalMembers) * 100).toFixed(1) : 0}%</td>
      </tr>
      <tr>
        <td>Receita Mensal</td>
        <td>R$ ${(stats.monthlyRevenue || 0).toLocaleString('pt-BR')}</td>
      </tr>
      <tr>
        <td>Taxa de Conformidade de Pagamentos</td>
        <td>${(stats.complianceRate || 0).toFixed(1)}%</td>
      </tr>
    </table>

    <h2>Próximas Reuniões</h2>
    ${stats.nextMeetings && stats.nextMeetings.length > 0 ? `
      <table>
        <tr>
          <th>Data</th>
          <th>Tipo</th>
          <th>Descrição</th>
        </tr>
        ${stats.nextMeetings.map((meeting: any) => `
          <tr>
            <td>${new Date(meeting.date).toLocaleDateString('pt-BR')}</td>
            <td>${meeting.type || 'N/A'}</td>
            <td>${meeting.description || 'N/A'}</td>
          </tr>
        `).join('')}
      </table>
    ` : '<p>Nenhuma reunião agendada</p>'}

    <h2>Observações</h2>
    <p>Este relatório foi gerado automaticamente pelo Sistema de Gestão de Lojas Maçônicas.</p>
    <p>Para mais detalhes, acesse o Dashboard Executivo no sistema.</p>
  `;

  exportToHTML(html, filename);
};

// Exportar dados de comunicados
export const exportComunicadosReport = (comunicados: any[], filename: string = 'relatorio-comunicados') => {
  const html = `
    <h1>Relatório de Comunicados</h1>
    <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
    
    <h2>Resumo</h2>
    <div>
      <div class="metric">
        <div class="metric-label">Total de Comunicados</div>
        <div class="metric-value">${comunicados.length}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Taxa Média de Leitura</div>
        <div class="metric-value">${comunicados.length > 0 ? (comunicados.reduce((sum, c) => sum + (c.read / c.total * 100), 0) / comunicados.length).toFixed(1) : 0}%</div>
      </div>
    </div>

    <h2>Detalhes dos Comunicados</h2>
    ${comunicados.length > 0 ? `
      <table>
        <tr>
          <th>Data</th>
          <th>Título</th>
          <th>Público</th>
          <th>Destinatários</th>
          <th>Leituras</th>
          <th>Taxa de Leitura</th>
        </tr>
        ${comunicados.map((com: any) => `
          <tr>
            <td>${com.date}</td>
            <td>${com.title}</td>
            <td>${com.audience}</td>
            <td>${com.total}</td>
            <td>${com.read}</td>
            <td>${((com.read / com.total) * 100).toFixed(1)}%</td>
          </tr>
        `).join('')}
      </table>
    ` : '<p>Nenhum comunicado encontrado</p>'}
  `;

  exportToHTML(html, filename);
};
