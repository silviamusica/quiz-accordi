// Script per estrarre tutte le combinazioni di domande di ChordMaster
// Esegui questo file con: node chord-questions-report.js

// Database degli accordi (copiato da App.js)
const chordDatabase = {
  1: { // Livello 1: Solo accordi maggiori (tutti i 12 accordi maggiori)
    questionsPerRound: 8,
    chords: [
      { notes: 'Do Mi Sol', name: 'Do maggiore', symbol: 'C', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
      { notes: 'Do# Mi# Sol#', name: 'Do diesis maggiore', symbol: 'C#', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
      { notes: 'Reb Fa Lab', name: 'Re bemolle maggiore', symbol: 'Db', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
      { notes: 'Re Fa# La', name: 'Re maggiore', symbol: 'D', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
      { notes: 'Mib Sol Sib', name: 'Mi bemolle maggiore', symbol: 'Eb', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
      { notes: 'Mi Sol# Si', name: 'Mi maggiore', symbol: 'E', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
      { notes: 'Fa La Do', name: 'Fa maggiore', symbol: 'F', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
      { notes: 'Fa# La# Do#', name: 'Fa diesis maggiore', symbol: 'F#', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
      { notes: 'Solb Sib Reb', name: 'Sol bemolle maggiore', symbol: 'Gb', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
      { notes: 'Sol Si Re', name: 'Sol maggiore', symbol: 'G', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
      { notes: 'Lab Do Mib', name: 'La bemolle maggiore', symbol: 'Ab', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
      { notes: 'La Do# Mi', name: 'La maggiore', symbol: 'A', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
      { notes: 'Sib Re Fa', name: 'Si bemolle maggiore', symbol: 'Bb', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
      { notes: 'Si Re# Fa#', name: 'Si maggiore', symbol: 'B', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' }
    ]
  },
  2: { // Livello 2: Solo accordi minori (tutti i 12 accordi minori)
    questionsPerRound: 8,
    chords: [
      { notes: 'Do Mib Sol', name: 'Do minore', symbol: 'Cm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
      { notes: 'Do# Mi Sol#', name: 'Do diesis minore', symbol: 'C#m', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
      { notes: 'Reb Fab Lab', name: 'Re bemolle minore', symbol: 'Dbm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
      { notes: 'Re Fa La', name: 'Re minore', symbol: 'Dm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
      { notes: 'Mib Solb Sib', name: 'Mi bemolle minore', symbol: 'Ebm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
      { notes: 'Mi Sol Si', name: 'Mi minore', symbol: 'Em', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
      { notes: 'Fa Lab Do', name: 'Fa minore', symbol: 'Fm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
      { notes: 'Fa# La Do#', name: 'Fa diesis minore', symbol: 'F#m', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
      { notes: 'Solb Sibb Reb', name: 'Sol bemolle minore', symbol: 'Gbm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
      { notes: 'Sol Sib Re', name: 'Sol minore', symbol: 'Gm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
      { notes: 'Lab Dob Mib', name: 'La bemolle minore', symbol: 'Abm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
      { notes: 'La Do Mi', name: 'La minore', symbol: 'Am', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
      { notes: 'Sib Reb Fa', name: 'Si bemolle minore', symbol: 'Bbm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
      { notes: 'Si Re Fa#', name: 'Si minore', symbol: 'Bm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' }
    ]
  }
  // Aggiungi tutti gli altri livelli qui...
};

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

// Funzione per generare il report
function generateChordReport() {
  console.log('🎵 CHORDMASTER - REPORT COMPLETO DELLE DOMANDE 🎵\n');
  console.log('=' * 80);
  
  Object.keys(chordDatabase).forEach(levelNum => {
    const level = chordDatabase[levelNum];
    const description = levelDescriptions[levelNum] || 'Sconosciuto';
    
    console.log(`\n📚 LIVELLO ${levelNum}: ${description}`);
    console.log(`📊 Domande per round: ${level.questionsPerRound}`);
    console.log(`🎼 Totale accordi disponibili: ${level.chords.length}`);
    console.log('-'.repeat(60));
    
    level.chords.forEach((chord, index) => {
      console.log(`${(index + 1).toString().padStart(2, '0')}. ${chord.symbol.padEnd(8)} | ${chord.name.padEnd(30)} | ${chord.notes}`);
    });
    
    console.log('-'.repeat(60));
  });
  
  // Statistiche generali
  const totalLevels = Object.keys(chordDatabase).length;
  const totalChords = Object.values(chordDatabase).reduce((sum, level) => sum + level.chords.length, 0);
  
  console.log(`\n📈 STATISTICHE GENERALI:`);
  console.log(`• Livelli totali: ${totalLevels}`);
  console.log(`• Accordi totali: ${totalChords}`);
  console.log(`• Media accordi per livello: ${Math.round(totalChords / totalLevels * 100) / 100}`);
}

// Funzione per generare report per categoria di filtro
function generateFilterReport() {
  console.log('\n🎹 REPORT PER CATEGORIE DI FILTRO:\n');
  
  const filters = ['bianchi', 'neri', 'entrambi'];
  
  filters.forEach(filter => {
    console.log(`\n🔍 FILTRO: ${filter.toUpperCase()}`);
    console.log('-'.repeat(40));
    
    Object.keys(chordDatabase).forEach(levelNum => {
      const level = chordDatabase[levelNum];
      const filtered = filterChordsByKeys(level.chords, filter);
      console.log(`Livello ${levelNum}: ${filtered.length}/${level.chords.length} accordi`);
    });
  });
}

// Funzione per filtrare accordi (copiata da App.js)
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

// Genera i report
if (require.main === module) {
  generateChordReport();
  generateFilterReport();
}

module.exports = { chordDatabase, generateChordReport, generateFilterReport };
