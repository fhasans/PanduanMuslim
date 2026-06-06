const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const content = fs.readFileSync('src/lib/supabase.js', 'utf8');
const urlMatch = content.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
const keyMatch = content.match(/supabaseAnonKey\s*=\s*['"]([^'"]+)['"]/);

if (urlMatch && keyMatch) {
    const supabase = createClient(urlMatch[1], keyMatch[1]);
    supabase.from('qadha_sholat_logs').select('*').limit(1).then(res => {
        fs.writeFileSync('db_check.txt', JSON.stringify(res.data[0] || {}));
    }).catch(err => {
        fs.writeFileSync('db_check.txt', 'Error: ' + err.message);
    });
} else {
    fs.writeFileSync('db_check.txt', 'Error: Could not parse credentials');
}
