// Script per verificare la corrispondenza tra il database accordi e il CSV
const fs = require('fs');

// Leggi il file App.js per estrarre il chordDatabase
const appContent = fs.readFileSync('./src/App.js', 'utf8');

// Estrai il chordDatabase dal file
const databaseStart = appContent.indexOf('const chordDatabase = {');
const databaseEnd = appContent.indexOf('  };', databaseStart) + 4;
const databaseCode = appContent.substring(databaseStart, databaseEnd);

// Valuta il codice per ottenere l'oggetto
const chordDatabase = eval('(' + databaseCode.replace('const chordDatabase = ', '') + ')');

console.log('=== VERIFICA CORRISPONDENZA DATABASE ACCORDI ===\n');

// Estrai tutti gli accordi e organizzali per verifica
let allChords = [];
let totalChords = 0;

Object.keys(chordDatabase).forEach(level => {
  const levelData = chordDatabase[level];
  console.log(`LIVELLO ${level}: ${levelData.chords.length} accordi`);
  
  levelData.chords.forEach(chord => {
    allChords.push({
      level: level,
      symbol: chord.symbol,
      name: chord.name,
      notes: chord.notes,
      explanation: chord.explanation
    });
  });
  
  totalChords += levelData.chords.length;
});

console.log(`\nTOTALE ACCORDI: ${totalChords}\n`);

// Raggruppa per tipo per confronto con CSV
const groupedChords = {};

allChords.forEach(chord => {
  let type = 'Altri';
  
  // Classifica gli accordi
  if (chord.explanation.includes('Triade maggiore')) type = 'Triadi Maggiori';
  else if (chord.explanation.includes('Triade minore')) type = 'Triadi Minori';
  else if (chord.explanation.includes('Triade aumentata')) type = 'Triadi Aumentate';
  else if (chord.explanation.includes('Triade diminuita')) type = 'Triadi Diminuite';
  else if (chord.explanation.includes('sospesa')) type = 'Accordi Sospesi';
  else if (chord.explanation.includes('aggiunta')) type = 'Accordi con Note Aggiunte';
  else if (chord.explanation.includes('settima maggiore')) type = 'Accordi di 7ª Maggiore';
  else if (chord.explanation.includes('settima minore') || chord.explanation.includes('settima dominante') || chord.symbol.includes('7/')) type = 'Accordi di 7ª Dominante';
  else if (chord.explanation.includes('nona')) type = 'Accordi di 9ª';
  else if (chord.explanation.includes('inversione')) {
    if (chord.explanation.includes('prima inversione')) type = 'Prime Inversioni';
    else if (chord.explanation.includes('seconda inversione')) type = 'Seconde Inversioni';
    else if (chord.explanation.includes('terza inversione')) type = 'Terze Inversioni';
    else if (chord.explanation.includes('quarta inversione')) type = 'Quarte Inversioni';
  }
  
  if (!groupedChords[type]) groupedChords[type] = [];
  groupedChords[type].push(chord);
});

// Mostra il riepilogo per tipo
console.log('=== RIEPILOGO PER TIPO ===');
Object.keys(groupedChords).sort().forEach(type => {
  console.log(`${type}: ${groupedChords[type].length} accordi`);
});

// Genera un file CSV per confronto
let csvContent = 'Tipo,Livello,Simbolo,Nome,Note,Spiegazione\n';

Object.keys(groupedChords).sort().forEach(type => {
  groupedChords[type].forEach(chord => {
    csvContent += `"${type}","${chord.level}","${chord.symbol}","${chord.name}","${chord.notes}","${chord.explanation}"\n`;
  });
});

fs.writeFileSync('./current-chords-export.csv', csvContent);
console.log('\n✅ File CSV esportato: current-chords-export.csv');

// Controlla specificamente le modifiche recenti
console.log('\n=== CONTROLLO MODIFICHE RECENTI ===');

// Controlla accordi di settima (terze inversioni)
const seventhInversions = allChords.filter(c => c.explanation.includes('terza inversione') && c.symbol.includes('7/'));
console.log(`\nTerze inversioni di settima (dovrebbero essere C7, D7, etc.): ${seventhInversions.length}`);
seventhInversions.forEach(chord => {
  console.log(`  ${chord.symbol}: ${chord.notes}`);
});

// Controlla accordi di nona (quarte inversioni)
const ninthInversions = allChords.filter(c => c.explanation.includes('quarta inversione') && c.symbol.includes('9/'));
console.log(`\nQuarte inversioni di nona: ${ninthInversions.length}`);
ninthInversions.forEach(chord => {
  console.log(`  ${chord.symbol}: ${chord.notes}`);
});

console.log('\n=== FINE VERIFICA ===');
