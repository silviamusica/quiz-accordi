#!/usr/bin/env node

/**
 * Verifica dettagliata della corrispondenza tra CSV e database app
 */

const fs = require('fs');

console.log('🔍 VERIFICA DETTAGLIATA CSV vs DATABASE APP\n');

try {
  // Leggi il file JSON estratto
  const jsonData = JSON.parse(fs.readFileSync('chordmaster-questions.json', 'utf8'));
  
  // Estrai tutti gli accordi dall'app
  const appChords = [];
  Object.keys(jsonData.levels).sort((a, b) => parseInt(a) - parseInt(b)).forEach(levelNum => {
    const level = jsonData.levels[levelNum];
    level.chords.forEach(chord => {
      appChords.push({
        level: levelNum,
        symbol: chord.symbol,
        name: chord.name,
        notes: chord.notes,
        explanation: chord.explanation
      });
    });
  });
  
  // Leggi e parsea il CSV
  const csvContent = fs.readFileSync('current-database-export.csv', 'utf8');
  const csvLines = csvContent.split('\n').filter(line => line.trim() && !line.startsWith('Tipo,'));
  
  const csvChords = [];
  csvLines.forEach(line => {
    if (line.trim()) {
      const matches = line.match(/"([^"]+)"/g);
      if (matches && matches.length >= 5) {
        csvChords.push({
          tipo: matches[0].replace(/"/g, ''),
          symbol: matches[1].replace(/"/g, ''),
          name: matches[2].replace(/"/g, ''),
          notes: matches[3].replace(/"/g, ''),
          explanation: matches[4].replace(/"/g, '')
        });
      }
    }
  });
  
  console.log(`📊 CONTEGGIO:`);
  console.log(`   • Accordi nell'app: ${appChords.length}`);
  console.log(`   • Accordi nel CSV: ${csvChords.length}`);
  
  if (appChords.length === csvChords.length) {
    console.log(`   ✅ Stesso numero di accordi\n`);
  } else {
    console.log(`   ❌ Numeri diversi!\n`);
  }
  
  // Verifica corrispondenza simboli
  const appSymbols = appChords.map(c => c.symbol).sort();
  const csvSymbols = csvChords.map(c => c.symbol).sort();
  
  const missingInCsv = appSymbols.filter(symbol => !csvSymbols.includes(symbol));
  const missingInApp = csvSymbols.filter(symbol => !appSymbols.includes(symbol));
  
  console.log(`🔍 VERIFICA SIMBOLI:`);
  if (missingInCsv.length === 0 && missingInApp.length === 0) {
    console.log(`   ✅ Tutti i simboli corrispondono\n`);
  } else {
    if (missingInCsv.length > 0) {
      console.log(`   ❌ Mancanti nel CSV: ${missingInCsv.join(', ')}`);
    }
    if (missingInApp.length > 0) {
      console.log(`   ❌ Mancanti nell'app: ${missingInApp.join(', ')}`);
    }
    console.log();
  }
  
  // Verifica corrispondenza dettagliata
  let differenze = 0;
  appChords.forEach(appChord => {
    const csvChord = csvChords.find(c => c.symbol === appChord.symbol);
    if (csvChord) {
      if (appChord.notes !== csvChord.notes) {
        console.log(`⚠️  DIFFERENZA NOTE in ${appChord.symbol}:`);
        console.log(`   APP: ${appChord.notes}`);
        console.log(`   CSV: ${csvChord.notes}\n`);
        differenze++;
      }
      if (appChord.name !== csvChord.name) {
        console.log(`⚠️  DIFFERENZA NOME in ${appChord.symbol}:`);
        console.log(`   APP: ${appChord.name}`);
        console.log(`   CSV: ${csvChord.name}\n`);
        differenze++;
      }
      if (appChord.explanation !== csvChord.explanation) {
        console.log(`⚠️  DIFFERENZA SPIEGAZIONE in ${appChord.symbol}:`);
        console.log(`   APP: ${appChord.explanation}`);
        console.log(`   CSV: ${csvChord.explanation}\n`);
        differenze++;
      }
    }
  });
  
  console.log(`📋 RISULTATO FINALE:`);
  if (appChords.length === csvChords.length && 
      missingInCsv.length === 0 && 
      missingInApp.length === 0 && 
      differenze === 0) {
    console.log(`   ✅ PERFETTA CORRISPONDENZA!`);
    console.log(`   Il CSV corrisponde esattamente al database dell'applicazione.`);
  } else {
    console.log(`   ❌ TROVATE DISCREPANZE:`);
    console.log(`   • Differenze nei dati: ${differenze}`);
    console.log(`   • Accordi mancanti nel CSV: ${missingInCsv.length}`);
    console.log(`   • Accordi mancanti nell'app: ${missingInApp.length}`);
  }
  
  // Mostra alcuni esempi di accordi per verifica manuale
  console.log(`\n🔍 ESEMPI DI ACCORDI (primi 5 dall'app):`);
  appChords.slice(0, 5).forEach(chord => {
    console.log(`   • ${chord.symbol}: ${chord.name} = ${chord.notes}`);
  });
  
  console.log(`\n🔍 ESEMPI DI ACCORDI (primi 5 dal CSV):`);
  csvChords.slice(0, 5).forEach(chord => {
    console.log(`   • ${chord.symbol}: ${chord.name} = ${chord.notes}`);
  });

} catch (error) {
  console.error('❌ Errore:', error.message);
  process.exit(1);
}
