// Script semplificato per estrarre tutti gli accordi dal database
const fs = require('fs');

console.log('=== ESTRAZIONE ACCORDI DAL DATABASE ===\n');

// Leggi il file App.js
const appContent = fs.readFileSync('./src/App.js', 'utf8');

// Estrai tutte le righe che definiscono accordi
const chordLines = appContent.match(/{ notes: '[^']+', name: '[^']+', symbol: '[^']+', explanation: '[^']+' }/g);

if (chordLines) {
  console.log(`Trovati ${chordLines.length} accordi nel database\n`);
  
  // Organizza per tipo
  const types = {};
  
  chordLines.forEach((line, index) => {
    // Estrai le parti dell'accordo
    const notesMatch = line.match(/notes: '([^']+)'/);
    const nameMatch = line.match(/name: '([^']+)'/);
    const symbolMatch = line.match(/symbol: '([^']+)'/);
    const explanationMatch = line.match(/explanation: '([^']+)'/);
    
    if (notesMatch && nameMatch && symbolMatch && explanationMatch) {
      const chord = {
        notes: notesMatch[1],
        name: nameMatch[1],
        symbol: symbolMatch[1],
        explanation: explanationMatch[1]
      };
      
      // Classifica per tipo
      let type = 'Altri';
      if (chord.explanation.includes('Triade maggiore')) type = 'Triadi Maggiori';
      else if (chord.explanation.includes('Triade minore')) type = 'Triadi Minori';
      else if (chord.explanation.includes('Triade aumentata')) type = 'Triadi Aumentate';
      else if (chord.explanation.includes('Triade diminuita')) type = 'Triadi Diminuite';
      else if (chord.explanation.includes('sospesa')) type = 'Accordi Sospesi';
      else if (chord.explanation.includes('aggiunta')) type = 'Accordi con Note Aggiunte';
      else if (chord.explanation.includes('settima maggiore')) type = 'Accordi di 7ª Maggiore';
      else if (chord.explanation.includes('settima') && (chord.explanation.includes('dominante') || chord.symbol.includes('7/'))) type = 'Accordi di 7ª Dominante';
      else if (chord.explanation.includes('nona')) type = 'Accordi di 9ª';
      else if (chord.explanation.includes('inversione')) {
        if (chord.explanation.includes('prima inversione')) type = 'Prime Inversioni';
        else if (chord.explanation.includes('seconda inversione')) type = 'Seconde Inversioni';
        else if (chord.explanation.includes('terza inversione')) type = 'Terze Inversioni';
        else if (chord.explanation.includes('quarta inversione')) type = 'Quarte Inversioni';
      }
      
      if (!types[type]) types[type] = [];
      types[type].push(chord);
    }
  });
  
  // Mostra riepilogo
  console.log('=== RIEPILOGO PER TIPO ===');
  Object.keys(types).sort().forEach(type => {
    console.log(`${type}: ${types[type].length} accordi`);
  });
  
  // Focus sulle modifiche recenti
  console.log('\n=== CONTROLLO MODIFICHE RECENTI ===');
  
  // Terze inversioni di settima
  if (types['Terze Inversioni']) {
    const seventhInversions = types['Terze Inversioni'].filter(c => c.symbol.includes('7/'));
    console.log(`\nTerze inversioni di settima: ${seventhInversions.length}`);
    seventhInversions.forEach(chord => {
      console.log(`  ${chord.symbol}: ${chord.notes} - ${chord.name}`);
    });
  }
  
  // Quarte inversioni di nona
  if (types['Quarte Inversioni']) {
    const ninthInversions = types['Quarte Inversioni'].filter(c => c.symbol.includes('9/'));
    console.log(`\nQuarte inversioni di nona: ${ninthInversions.length}`);
    ninthInversions.forEach(chord => {
      console.log(`  ${chord.symbol}: ${chord.notes} - ${chord.name}`);
    });
  }
  
  // Genera CSV per confronto
  let csvContent = 'Tipo,Simbolo,Nome,Note,Spiegazione\n';
  
  Object.keys(types).sort().forEach(type => {
    types[type].forEach(chord => {
      csvContent += `"${type}","${chord.symbol}","${chord.name}","${chord.notes}","${chord.explanation}"\n`;
    });
  });
  
  fs.writeFileSync('./current-database-export.csv', csvContent);
  console.log('\n✅ Database esportato in: current-database-export.csv');
  
} else {
  console.log('❌ Nessun accordo trovato nel database');
}

console.log('\n=== FINE CONTROLLO ===');
