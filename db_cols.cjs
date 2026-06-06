const fs = require('fs');

async function check() {
  const content = fs.readFileSync('src/lib/supabase.js', 'utf8');
  const urlMatch = content.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
  const keyMatch = content.match(/supabaseAnonKey\s*=\s*['"]([^'"]+)['"]/);
  if(urlMatch && keyMatch) {
    const r = await fetch(urlMatch[1] + '/rest/v1/qadha_sholat_logs?limit=1', {
      headers: { 'apikey': keyMatch[1], 'Authorization': 'Bearer ' + keyMatch[1] }
    });
    const d = await r.json();
    fs.writeFileSync('db_cols.txt', JSON.stringify(Object.keys(d[0] || {})));
  }
}
check();
