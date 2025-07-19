// ChordMaster - Estrattore di tutte le combinazioni di domande
// Questo script analizza il file App.js ed estrae tutti gli accordi per ogni livello

const fs = require('fs');
const path = require('path');

// Funzione per estrarre il database dal file App.js
function extractChordDatabase() {
  try {
    const appJsPath = path.join(__dirname, 'src', 'App.js');
    const content = fs.readFileSync(appJsPath, 'utf8');
    
    // Trova l'inizio e la fine del chordDatabase
    const startMarker = 'const chordDatabase = {';
    const startIndex = content.indexOf(startMarker);
    
    if (startIndex === -1) {
      throw new Error('ChordDatabase non trovato nel file App.js');
    }
    
    // Trova la fine del database (cerca la chiusura della variabile)
    let braceCount = 0;
    let endIndex = startIndex + startMarker.length;
    let inString = false;
    let stringChar = '';
    
    for (let i = endIndex; i < content.length; i++) {
      const char = content[i];
      
      // Gestisce le stringhe
      if ((char === '"' || char === "'") && !inString) {
        inString = true;
        stringChar = char;
        continue;
      } else if (char === stringChar && inString) {
        inString = false;
        stringChar = '';
        continue;
      }
      
      if (!inString) {
        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }
    }
    
    const databaseCode = content.substring(startIndex, endIndex);
    
    // Salva il database estratto
    const extractedContent = `
// Database estratto da App.js
${databaseCode}

// Descrizioni dei livelli
const levelDescriptions = {
  1: 'Accordi Maggiori',
  2: 'Accordi Minori',
  3: 'Settime di Dominante', 
  4: 'Settime Maggiori',
  5: 'Settime Minori',
  6: 'Accordi di Sesta',
  7: 'Accordi Diminuiti',
  8: 'Accordi Aumentati',
  9: 'Rivolti/Inversioni',
  10: 'Accordi di Nona',
  11: 'Accordi Sospesi',
  12: 'Note Aggiunte',
  13: 'Mix di Tutto'
};

module.exports = { chordDatabase, levelDescriptions };
`;
    
    fs.writeFileSync(path.join(__dirname, 'extracted-chords.js'), extractedContent);
    console.log('✅ Database estratto e salvato in extracted-chords.js');
    
    return true;
  } catch (error) {
    console.error('❌ Errore nell\'estrazione:', error.message);
    return false;
  }
}

// Funzione per generare report dettagliato
function generateDetailedReport() {
  try {
    const { chordDatabase, levelDescriptions } = require('./extracted-chords.js');
    
    let report = '';
    report += '🎵 CHORDMASTER - REPORT COMPLETO DELLE DOMANDE\\n';
    report += '='.repeat(80) + '\\n\\n';
    
    // Report per ogni livello
    Object.keys(chordDatabase).sort((a, b) => parseInt(a) - parseInt(b)).forEach(levelNum => {
      const level = chordDatabase[levelNum];
      const description = levelDescriptions[levelNum] || 'Sconosciuto';
      
      report += `📚 LIVELLO ${levelNum}: ${description}\\n`;
      report += `📊 Domande per round: ${level.questionsPerRound}\\n`;
      report += `🎼 Totale accordi disponibili: ${level.chords.length}\\n`;
      report += '-'.repeat(80) + '\\n';
      
      level.chords.forEach((chord, index) => {
        const num = (index + 1).toString().padStart(2, '0');
        const symbol = chord.symbol.padEnd(10);
        const name = chord.name.padEnd(35);
        const notes = chord.notes.padEnd(20);
        report += `${num}. ${symbol} | ${name} | ${notes}\\n`;
      });
      
      report += '-'.repeat(80) + '\\n\\n';
    });
    
    // Statistiche generali
    const totalLevels = Object.keys(chordDatabase).length;
    const totalChords = Object.values(chordDatabase).reduce((sum, level) => sum + level.chords.length, 0);
    const avgChords = Math.round(totalChords / totalLevels * 100) / 100;
    
    report += '📈 STATISTICHE GENERALI:\\n';
    report += `• Livelli totali: ${totalLevels}\\n`;
    report += `• Accordi totali: ${totalChords}\\n`;
    report += `• Media accordi per livello: ${avgChords}\\n\\n`;
    
    // Report per categorie
    report += '🎹 ANALISI PER CATEGORIA DI TASTI:\\n';
    report += '-'.repeat(50) + '\\n';
    
    ['bianchi', 'neri', 'entrambi'].forEach(filter => {
      report += `\\n🔍 FILTRO: ${filter.toUpperCase()}\\n`;
      
      Object.keys(chordDatabase).sort((a, b) => parseInt(a) - parseInt(b)).forEach(levelNum => {
        const level = chordDatabase[levelNum];
        const filtered = filterChordsByKeys(level.chords, filter);
        const percentage = Math.round((filtered.length / level.chords.length) * 100);
        report += `Livello ${levelNum.padStart(2)}: ${filtered.length.toString().padStart(2)}/${level.chords.length.toString().padStart(2)} accordi (${percentage}%)\\n`;
      });
    });
    
    // Salva il report
    fs.writeFileSync(path.join(__dirname, 'chord-report.txt'), report);
    console.log('✅ Report completo salvato in chord-report.txt');
    
    // Mostra anche in console
    console.log('\\n' + report);
    
  } catch (error) {
    console.error('❌ Errore nella generazione del report:', error.message);
  }
}

// Funzione per filtrare accordi per tasti
function filterChordsByKeys(chords, filter = 'entrambi') {
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

// Esegui l'estrazione e la generazione del report
console.log('🚀 Avvio estrazione combinazioni di domande ChordMaster...\\n');

if (extractChordDatabase()) {
  generateDetailedReport();
  console.log('\\n✨ Operazione completata con successo!');
  console.log('📁 File generati:');
  console.log('   • extracted-chords.js (database estratto)');
  console.log('   • chord-report.txt (report completo)');
} else {
  console.log('\\n❌ Estrazione fallita. Controlla il percorso del file App.js');
}
