#!/usr/bin/env node

/**
 * ChordMaster Questions Extractor
 * Estrae tutte le combinazioni di domande dall'app ChordMaster
 */

const fs = require('fs');
const path = require('path');

console.log('🎵 ChordMaster - Estrazione Combinazioni di Domande\n');

try {
  // Legge il file App.js
  const appJsPath = path.join(__dirname, 'src', 'App.js');
  const content = fs.readFileSync(appJsPath, 'utf8');
  
  // Estrai il pattern del chordDatabase con regex più precisa
  const dbMatch = content.match(/const chordDatabase = \{([\s\S]*?)\n  \};\s*\n\s*\/\/ Funzione per verificare/);
  
  if (!dbMatch) {
    throw new Error('ChordDatabase non trovato nel file App.js');
  }
  
  console.log('✅ ChordDatabase trovato nel codice');
  
  // Costruisce l'oggetto database manualmente analizzando il testo
  const lines = dbMatch[1].split('\n');
  const levels = {};
  let currentLevel = null;
  let currentChords = [];
  let questionsPerRound = 8;
  
  for (let line of lines) {
    line = line.trim();
    
    // Rileva nuovo livello
    const levelMatch = line.match(/^(\d+):\s*\{.*\/\/.*Livello\s*\d+:\s*(.+)/);
    if (levelMatch) {
      // Salva il livello precedente se esiste
      if (currentLevel) {
        levels[currentLevel] = {
          description: levels[currentLevel].description,
          questionsPerRound: questionsPerRound,
          chords: [...currentChords]
        };
      }
      
      currentLevel = levelMatch[1];
      currentChords = [];
      
      // Estrai descrizione dal commento
      const description = levelMatch[2].replace(/\(.+\)/, '').trim();
      levels[currentLevel] = { description: description };
      continue;
    }
    
    // Rileva questionsPerRound
    const questionsMatch = line.match(/questionsPerRound:\s*(\d+)/);
    if (questionsMatch) {
      questionsPerRound = parseInt(questionsMatch[1]);
      continue;
    }
    
    // Rileva accordo
    const chordMatch = line.match(/\{\s*notes:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"],\s*symbol:\s*['"]([^'"]+)['"],\s*explanation:\s*['"]([^'"]+)['"]\s*\}/);
    if (chordMatch) {
      currentChords.push({
        notes: chordMatch[1],
        name: chordMatch[2], 
        symbol: chordMatch[3],
        explanation: chordMatch[4]
      });
    }
  }
  
  // Salva l'ultimo livello
  if (currentLevel) {
    levels[currentLevel] = {
      description: levels[currentLevel].description,
      questionsPerRound: questionsPerRound,
      chords: [...currentChords]
    };
  }
  
  console.log(`✅ Estratti ${Object.keys(levels).length} livelli`);
  
  // Genera report dettagliato
  const report = {
    metadata: {
      generatedAt: new Date().toISOString(),
      generatedBy: 'ChordMaster Questions Extractor',
      totalLevels: Object.keys(levels).length,
      totalChords: Object.values(levels).reduce((sum, level) => sum + level.chords.length, 0)
    },
    levels: levels
  };
  
  // Salva JSON strutturato
  fs.writeFileSync('chordmaster-questions.json', JSON.stringify(report, null, 2));
  
  // Genera report testuale
  let textReport = '';
  textReport += '🎵 CHORDMASTER - TUTTE LE COMBINAZIONI DI DOMANDE\n';
  textReport += '='.repeat(80) + '\n\n';
  textReport += `Generato il: ${new Date().toLocaleString('it-IT')}\n`;
  textReport += `Livelli totali: ${report.metadata.totalLevels}\n`;
  textReport += `Accordi totali: ${report.metadata.totalChords}\n\n`;
  
  // Report per ogni livello
  Object.keys(levels).sort((a, b) => parseInt(a) - parseInt(b)).forEach(levelNum => {
    const level = levels[levelNum];
    textReport += `📚 LIVELLO ${levelNum}: ${level.description}\n`;
    textReport += `📊 Domande per round: ${level.questionsPerRound}\n`;
    textReport += `🎼 Totale accordi: ${level.chords.length}\n`;
    textReport += '-'.repeat(80) + '\n';
    
    level.chords.forEach((chord, index) => {
      const num = (index + 1).toString().padStart(2, '0');
      const symbol = chord.symbol.padEnd(10);
      const name = chord.name.padEnd(35);
      textReport += `${num}. ${symbol} | ${name} | ${chord.notes}\n`;
    });
    
    textReport += '\n';
  });
  
  // Statistiche per categoria di tasti
  textReport += '🎹 ANALISI PER CATEGORIA DI TASTI:\n';
  textReport += '-'.repeat(50) + '\n\n';
  
  ['bianchi', 'neri', 'entrambi'].forEach(filter => {
    textReport += `🔍 FILTRO: ${filter.toUpperCase()}\n`;
    
    Object.keys(levels).sort((a, b) => parseInt(a) - parseInt(b)).forEach(levelNum => {
      const level = levels[levelNum];
      const filtered = filterChords(level.chords, filter);
      const percentage = Math.round((filtered.length / level.chords.length) * 100);
      textReport += `Livello ${levelNum.padStart(2)}: ${filtered.length.toString().padStart(2)}/${level.chords.length.toString().padStart(2)} accordi (${percentage}%)\n`;
    });
    textReport += '\n';
  });
  
  fs.writeFileSync('chordmaster-report.txt', textReport);
  
  console.log('\n🎯 ESTRAZIONE COMPLETATA!');
  console.log('📁 File generati:');
  console.log('   • chordmaster-questions.json (formato JSON strutturato)');
  console.log('   • chordmaster-report.txt (formato testo leggibile)');
  console.log('\n📊 Riepilogo:');
  console.log(`   • Livelli estratti: ${report.metadata.totalLevels}`);
  console.log(`   • Accordi totali: ${report.metadata.totalChords}`);
  console.log(`   • Media accordi per livello: ${Math.round(report.metadata.totalChords / report.metadata.totalLevels)}`);
  
  // Mostra preview dei primi livelli
  console.log('\n🔍 PREVIEW PRIMI 3 LIVELLI:');
  Object.keys(levels).slice(0, 3).forEach(levelNum => {
    const level = levels[levelNum];
    console.log(`   Livello ${levelNum}: ${level.description} (${level.chords.length} accordi)`);
  });
  
} catch (error) {
  console.error('❌ Errore durante l\'estrazione:', error.message);
  process.exit(1);
}

// Funzione helper per filtrare accordi per tasti
function filterChords(chords, filter) {
  if (filter === 'entrambi') return chords;
  
  const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackKeys = ['C#', 'Db', 'D#', 'Eb', 'F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb'];
  
  return chords.filter(chord => {
    let rootNote = chord.symbol.replace(/[^A-G#b]/g, '');
    
    if (rootNote.includes('#')) {
      rootNote = rootNote.substring(0, 2);
    } else if (rootNote.includes('b')) {
      rootNote = rootNote.substring(0, 2);
    } else {
      rootNote = rootNote.charAt(0);
    }
    
    if (filter === 'bianchi') {
      return whiteKeys.includes(rootNote);
    } else if (filter === 'neri') {
      return blackKeys.includes(rootNote);
    }
    return true;
  });
}
