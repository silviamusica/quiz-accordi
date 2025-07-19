import React, { useState, useEffect } from 'react';

// Componente Coriandoli
const Confetti = ({ show }) => {
  if (!show) return null;

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'][i % 7],
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    left: Math.random() * 100,
    rotation: Math.random() * 360
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-bounce"
          style={{
            backgroundColor: piece.color,
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
            top: '-10px'
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-bounce {
          animation: confetti-fall 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

const ChordMaster= () => {
  const [screen, setScreen] = useState('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentChord, setCurrentChord] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [learnCategory, setLearnCategory] = useState('major-minor');
  const [keyFilter, setKeyFilter] = useState('bianchi'); // 'bianchi', 'neri', 'entrambi'
  const [questionsPerGame, setQuestionsPerGame] = useState(10); // Numero di domande per partita
  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    const saved = localStorage.getItem('chordmaster-unlocked-levels');
    let levels = saved ? JSON.parse(saved) : [1];
    
    // Migrazione dai vecchi numeri di livello ai nuovi
    const oldToNewMapping = {
      1: 1, 2: 2, 4: 3, 6: 4, 7: 5, 9: 6, 10: 7, 11: 8, 13: 9, 14: 10, 15: 11, 16: 12, 17: 13
    };
    
    // Converte i vecchi numeri in nuovi se necessario
    levels = levels.map(level => oldToNewMapping[level] || level).filter(level => level >= 1 && level <= 13);
    
    // Rimuove duplicati e ordina
    levels = [...new Set(levels)].sort((a, b) => a - b);
    
    // Se la lista è vuota, inizia con livello 1
    if (levels.length === 0) levels = [1];
    
    return levels;
  }); // Livelli sbloccati, inizia solo con livello 1
  const [showConfetti, setShowConfetti] = useState(false); // Stato per i coriandoli
  const [devKeys, setDevKeys] = useState(''); // Sequenza tasti per sviluppatore

  // Salva i livelli sbloccati in localStorage
  useEffect(() => {
    localStorage.setItem('chordmaster-unlocked-levels', JSON.stringify(unlockedLevels));
  }, [unlockedLevels]);

  // Listener per combinazione tasti sviluppatore
  useEffect(() => {
    const handleKeyPress = (e) => {
      const newKeys = devKeys + e.key.toLowerCase();
      setDevKeys(newKeys);
      
      // Se digita 'fgh' sblocca tutti i livelli
      if (newKeys.includes('fgh')) {
        // Sblocca automaticamente tutti i livelli disponibili nel chordDatabase
        const allLevelNumbers = Object.keys(chordDatabase).map(Number).filter(num => !isNaN(num));
        setUnlockedLevels(allLevelNumbers);
        setDevKeys('');
        console.log(`🔓 Tutti i ${allLevelNumbers.length} livelli sbloccati per sviluppo!`);
      }
      
      // Se digita 'fgf' apre la modalità debug delle domande
      if (newKeys.includes('fgf')) {
        setScreen('debug');
        setDevKeys('');
        console.log('🔍 Modalità debug domande attivata!');
      }
      
      // Se digita 'ghg' apre la modalità teoria completa
      if (newKeys.includes('ghg')) {
        setScreen('theory');
        setDevKeys('');
        console.log('📚 Modalità teoria completa attivata!');
      }
      
      // Reset dopo 2 secondi
      setTimeout(() => setDevKeys(''), 2000);
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [devKeys]);

  // Database accordi riorganizzato per livelli progressivi
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
        { notes: 'Re Fa La', name: 'Re minore', symbol: 'Dm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
        { notes: 'Re# Fa# La#', name: 'Re diesis minore', symbol: 'D#m', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
        { notes: 'Mib Solb Sib', name: 'Mi bemolle minore', symbol: 'Ebm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
        { notes: 'Mi Sol Si', name: 'Mi minore', symbol: 'Em', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
        { notes: 'Fa Lab Do', name: 'Fa minore', symbol: 'Fm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
        { notes: 'Fa# La Do#', name: 'Fa diesis minore', symbol: 'F#m', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
        { notes: 'Sol Sib Re', name: 'Sol minore', symbol: 'Gm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
        { notes: 'Sol# Si Re#', name: 'Sol diesis minore', symbol: 'G#m', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
        { notes: 'La Do Mi', name: 'La minore', symbol: 'Am', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
        { notes: 'La# Do# Mi#', name: 'La diesis minore', symbol: 'A#m', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
        { notes: 'Sib Reb Fa', name: 'Si bemolle minore', symbol: 'Bbm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' },
        { notes: 'Si Re Fa#', name: 'Si minore', symbol: 'Bm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta' }
      ]
    },
    3: { // Livello 3: Solo accordi diminuiti (tutti i 12 accordi)
      questionsPerRound: 8,
      chords: [
        { notes: 'Do Mib Solb', name: 'Do diminuito', symbol: 'C°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Do# Mi Sol', name: 'Do diesis diminuito', symbol: 'C#°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Reb Fab Labb', name: 'Re bemolle diminuito', symbol: 'Db°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Re Fa Lab', name: 'Re diminuito', symbol: 'D°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Re# Fa# La', name: 'Re diesis diminuito', symbol: 'D#°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Mib Solb Sibb', name: 'Mi bemolle diminuito', symbol: 'Eb°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Mi Sol Sib', name: 'Mi diminuito', symbol: 'E°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Fa Lab Dob', name: 'Fa diminuito', symbol: 'F°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Fa# La Do', name: 'Fa diesis diminuito', symbol: 'F#°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Sol Sib Reb', name: 'Sol diminuito', symbol: 'G°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Sol# Si Re', name: 'Sol diesis diminuito', symbol: 'G#°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'La Do Mib', name: 'La diminuito', symbol: 'A°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'La# Do# Mi', name: 'La diesis diminuito', symbol: 'A#°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Sib Reb Fab', name: 'Si bemolle diminuito', symbol: 'Bb°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Si Re Fa', name: 'Si diminuito', symbol: 'B°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' }
      ]
    },
    4: { // Livello 4: Solo accordi aumentati (tutti i 12 accordi)
      questionsPerRound: 8,
      chords: [
        { notes: 'Do Mi Sol#', name: 'Do aumentato', symbol: 'C+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Do# Mi# Sol##', name: 'Do diesis aumentato', symbol: 'C#+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Reb Fa La', name: 'Re bemolle aumentato', symbol: 'Db+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Re Fa# La#', name: 'Re aumentato', symbol: 'D+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Mib Sol Si', name: 'Mi bemolle aumentato', symbol: 'Eb+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Mi Sol# Si#', name: 'Mi aumentato', symbol: 'E+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Fa La Do#', name: 'Fa aumentato', symbol: 'F+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Fa# La# Do##', name: 'Fa diesis aumentato', symbol: 'F#+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Solb Sib Re', name: 'Sol bemolle aumentato', symbol: 'Gb+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Sol Si Re#', name: 'Sol aumentato', symbol: 'G+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Lab Do Mi', name: 'La bemolle aumentato', symbol: 'Ab+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'La Do# Mi#', name: 'La aumentato', symbol: 'A+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Sib Re Fa#', name: 'Si bemolle aumentato', symbol: 'Bb+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Si Re# Fa##', name: 'Si aumentato', symbol: 'B+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' }
      ]
    },
    5: { // Livello 5: Solo settime di dominante (tutti i 12 accordi)
      questionsPerRound: 8,
      chords: [
        { notes: 'Do Mi Sol Sib', name: 'Do settima', symbol: 'C7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Do# Mi# Sol# Si', name: 'Do diesis settima', symbol: 'C#7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Reb Fa Lab Dob', name: 'Re bemolle settima', symbol: 'Db7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Re Fa# La Do', name: 'Re settima', symbol: 'D7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Mib Sol Sib Reb', name: 'Mi bemolle settima', symbol: 'Eb7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Mi Sol# Si Re', name: 'Mi settima', symbol: 'E7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Fa La Do Mib', name: 'Fa settima', symbol: 'F7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Fa# La# Do# Mi', name: 'Fa diesis settima', symbol: 'F#7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Solb Sib Reb Fab', name: 'Sol bemolle settima', symbol: 'Gb7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Sol Si Re Fa', name: 'Sol settima', symbol: 'G7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Lab Do Mib Solb', name: 'La bemolle settima', symbol: 'Ab7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'La Do# Mi Sol', name: 'La settima', symbol: 'A7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Sib Re Fa Lab', name: 'Si bemolle settima', symbol: 'Bb7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Si Re# Fa# La', name: 'Si settima', symbol: 'B7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' }
      ]
    },
    6: { // Livello 6: Solo settime maggiori (tutti i 12 accordi)
      questionsPerRound: 8,
      chords: [
        { notes: 'Do Mi Sol Si', name: 'Do settima maggiore', symbol: 'Cmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Do# Mi# Sol# Si#', name: 'Do diesis settima maggiore', symbol: 'C#maj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Reb Fa Lab Do', name: 'Re bemolle settima maggiore', symbol: 'Dbmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Re Fa# La Do#', name: 'Re settima maggiore', symbol: 'Dmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Mib Sol Sib Re', name: 'Mi bemolle settima maggiore', symbol: 'Ebmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Mi Sol# Si Re#', name: 'Mi settima maggiore', symbol: 'Emaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Fa La Do Mi', name: 'Fa settima maggiore', symbol: 'Fmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Fa# La# Do# Mi#', name: 'Fa diesis settima maggiore', symbol: 'F#maj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Solb Sib Reb Fa', name: 'Sol bemolle settima maggiore', symbol: 'Gbmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Sol Si Re Fa#', name: 'Sol settima maggiore', symbol: 'Gmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Lab Do Mib Sol', name: 'La bemolle settima maggiore', symbol: 'Abmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'La Do# Mi Sol#', name: 'La settima maggiore', symbol: 'Amaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Sib Re Fa La', name: 'Si bemolle settima maggiore', symbol: 'Bbmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Si Re# Fa# La#', name: 'Si settima maggiore', symbol: 'Bmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' }
      ]
    },
    7: { // Livello 7: Solo settime minori (tutti i 12 accordi minori settima)
      questionsPerRound: 8,
      chords: [
        { notes: 'Do Mib Sol Sib', name: 'Do minore settima', symbol: 'Cm7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Do# Mi Sol# Si', name: 'Do diesis minore settima', symbol: 'C#m7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Reb Fab Lab Dob', name: 'Re bemolle minore settima', symbol: 'Dbm7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Re Fa La Do', name: 'Re minore settima', symbol: 'Dm7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Re# Fa# La# Do#', name: 'Re diesis minore settima', symbol: 'D#m7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Mib Solb Sib Reb', name: 'Mi bemolle minore settima', symbol: 'Ebm7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Mi Sol Si Re', name: 'Mi minore settima', symbol: 'Em7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Fa Lab Do Mib', name: 'Fa minore settima', symbol: 'Fm7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Fa# La Do# Mi', name: 'Fa diesis minore settima', symbol: 'F#m7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Sol Sib Re Fa', name: 'Sol minore settima', symbol: 'Gm7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Sol# Si Re# Fa#', name: 'Sol diesis minore settima', symbol: 'G#m7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Lab Dob Mib Solb', name: 'La bemolle minore settima', symbol: 'Abm7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'La Do Mi Sol', name: 'La minore settima', symbol: 'Am7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'La# Do# Mi# Sol#', name: 'La diesis minore settima', symbol: 'A#m7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Sib Reb Fa Lab', name: 'Si bemolle minore settima', symbol: 'Bbm7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Si Re Fa# La', name: 'Si minore settima', symbol: 'Bm7', explanation: 'Settima minore: triade minore + settima minore' }
      ]
    },
    8: { // Livello 8: Solo accordi di sesta (tutti i 12 accordi)
      questionsPerRound: 8,
      chords: [
        { notes: 'Do Mi Sol La', name: 'Do maggiore sesta', symbol: 'C6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' },
        { notes: 'Do# Mi# Sol# La#', name: 'Do diesis maggiore sesta', symbol: 'C#6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' },
        { notes: 'Reb Fa Lab Sib', name: 'Re bemolle maggiore sesta', symbol: 'Db6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' },
        { notes: 'Re Fa# La Si', name: 'Re maggiore sesta', symbol: 'D6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' },
        { notes: 'Mib Sol Sib Do', name: 'Mi bemolle maggiore sesta', symbol: 'Eb6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' },
        { notes: 'Mi Sol# Si Do#', name: 'Mi maggiore sesta', symbol: 'E6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' },
        { notes: 'Fa La Do Re', name: 'Fa maggiore sesta', symbol: 'F6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' },
        { notes: 'Fa# La# Do# Re#', name: 'Fa diesis maggiore sesta', symbol: 'F#6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' },
        { notes: 'Solb Sib Reb Mib', name: 'Sol bemolle maggiore sesta', symbol: 'Gb6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' },
        { notes: 'Sol Si Re Mi', name: 'Sol maggiore sesta', symbol: 'G6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' },
        { notes: 'Lab Do Mib Fa', name: 'La bemolle maggiore sesta', symbol: 'Ab6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' },
        { notes: 'La Do# Mi Fa#', name: 'La maggiore sesta', symbol: 'A6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' },
        { notes: 'Sib Re Fa Sol', name: 'Si bemolle maggiore sesta', symbol: 'Bb6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' },
        { notes: 'Si Re# Fa# Sol#', name: 'Si maggiore sesta', symbol: 'B6', explanation: 'Accordo di sesta maggiore: triade maggiore + sesta maggiore' }
      ]
    },
    9: { // Livello 9: Solo inversioni (slash chords) - tutte le inversioni
      questionsPerRound: 10,
      chords: [
        // Inversioni di Do maggiore
        { notes: 'Mi Sol Do', name: 'Do maggiore prima inversione', symbol: 'C/E', explanation: 'Prima inversione: la terza (Mi) al basso' },
        { notes: 'Sol Do Mi', name: 'Do maggiore seconda inversione', symbol: 'C/G', explanation: 'Seconda inversione: la quinta (Sol) al basso' },
        
        // Inversioni di Do# maggiore
        { notes: 'Mi# Sol# Do#', name: 'Do diesis maggiore prima inversione', symbol: 'C#/E#', explanation: 'Prima inversione: la terza (Mi#) al basso' },
        { notes: 'Sol# Do# Mi#', name: 'Do diesis maggiore seconda inversione', symbol: 'C#/G#', explanation: 'Seconda inversione: la quinta (Sol#) al basso' },
        
        // Inversioni di Reb maggiore
        { notes: 'Fa Lab Reb', name: 'Re bemolle maggiore prima inversione', symbol: 'Db/F', explanation: 'Prima inversione: la terza (Fa) al basso' },
        { notes: 'Lab Reb Fa', name: 'Re bemolle maggiore seconda inversione', symbol: 'Db/Ab', explanation: 'Seconda inversione: la quinta (Lab) al basso' },
        
        // Inversioni di Re maggiore
        { notes: 'Fa# La Re', name: 'Re maggiore prima inversione', symbol: 'D/F#', explanation: 'Prima inversione: la terza (Fa#) al basso' },
        { notes: 'La Re Fa#', name: 'Re maggiore seconda inversione', symbol: 'D/A', explanation: 'Seconda inversione: la quinta (La) al basso' },
        
        // Inversioni di Mib maggiore
        { notes: 'Sol Sib Mib', name: 'Mi bemolle maggiore prima inversione', symbol: 'Eb/G', explanation: 'Prima inversione: la terza (Sol) al basso' },
        { notes: 'Sib Mib Sol', name: 'Mi bemolle maggiore seconda inversione', symbol: 'Eb/Bb', explanation: 'Seconda inversione: la quinta (Sib) al basso' },
        
        // Inversioni di Mi maggiore
        { notes: 'Sol# Si Mi', name: 'Mi maggiore prima inversione', symbol: 'E/G#', explanation: 'Prima inversione: la terza (Sol#) al basso' },
        { notes: 'Si Mi Sol#', name: 'Mi maggiore seconda inversione', symbol: 'E/B', explanation: 'Seconda inversione: la quinta (Si) al basso' },
        
        // Inversioni di Fa maggiore
        { notes: 'La Do Fa', name: 'Fa maggiore prima inversione', symbol: 'F/A', explanation: 'Prima inversione: la terza (La) al basso' },
        { notes: 'Do Fa La', name: 'Fa maggiore seconda inversione', symbol: 'F/C', explanation: 'Seconda inversione: la quinta (Do) al basso' },
        
        // Inversioni di Fa# maggiore
        { notes: 'La# Do# Fa#', name: 'Fa diesis maggiore prima inversione', symbol: 'F#/A#', explanation: 'Prima inversione: la terza (La#) al basso' },
        { notes: 'Do# Fa# La#', name: 'Fa diesis maggiore seconda inversione', symbol: 'F#/C#', explanation: 'Seconda inversione: la quinta (Do#) al basso' },
        
        // Inversioni di Solb maggiore
        { notes: 'Sib Reb Solb', name: 'Sol bemolle maggiore prima inversione', symbol: 'Gb/Bb', explanation: 'Prima inversione: la terza (Sib) al basso' },
        { notes: 'Reb Solb Sib', name: 'Sol bemolle maggiore seconda inversione', symbol: 'Gb/Db', explanation: 'Seconda inversione: la quinta (Reb) al basso' },
        
        // Inversioni di Sol maggiore
        { notes: 'Si Re Sol', name: 'Sol maggiore prima inversione', symbol: 'G/B', explanation: 'Prima inversione: la terza (Si) al basso' },
        { notes: 'Re Sol Si', name: 'Sol maggiore seconda inversione', symbol: 'G/D', explanation: 'Seconda inversione: la quinta (Re) al basso' },
        
        // Inversioni di Lab maggiore
        { notes: 'Do Mib Lab', name: 'La bemolle maggiore prima inversione', symbol: 'Ab/C', explanation: 'Prima inversione: la terza (Do) al basso' },
        { notes: 'Mib Lab Do', name: 'La bemolle maggiore seconda inversione', symbol: 'Ab/Eb', explanation: 'Seconda inversione: la quinta (Mib) al basso' },
        
        // Inversioni di La maggiore
        { notes: 'Do# Mi La', name: 'La maggiore prima inversione', symbol: 'A/C#', explanation: 'Prima inversione: la terza (Do#) al basso' },
        { notes: 'Mi La Do#', name: 'La maggiore seconda inversione', symbol: 'A/E', explanation: 'Seconda inversione: la quinta (Mi) al basso' },
        
        // Inversioni di Sib maggiore
        { notes: 'Re Fa Sib', name: 'Si bemolle maggiore prima inversione', symbol: 'Bb/D', explanation: 'Prima inversione: la terza (Re) al basso' },
        { notes: 'Fa Sib Re', name: 'Si bemolle maggiore seconda inversione', symbol: 'Bb/F', explanation: 'Seconda inversione: la quinta (Fa) al basso' },
        
        // Inversioni di Si maggiore
        { notes: 'Re# Fa# Si', name: 'Si maggiore prima inversione', symbol: 'B/D#', explanation: 'Prima inversione: la terza (Re#) al basso' },
        { notes: 'Fa# Si Re#', name: 'Si maggiore seconda inversione', symbol: 'B/F#', explanation: 'Seconda inversione: la quinta (Fa#) al basso' },
        
        // Inversioni di accordi di settima (terza inversione)
        { notes: 'Sib Do Mi Sol', name: 'Do settima terza inversione', symbol: 'C7/B', explanation: 'Terza inversione: la settima (Sib) al basso' },
        { notes: 'Do Re Fa# La', name: 'Re settima terza inversione', symbol: 'D7/C#', explanation: 'Terza inversione: la settima (Do) al basso' },
        { notes: 'Re Mi Sol# Si', name: 'Mi settima terza inversione', symbol: 'E7/D#', explanation: 'Terza inversione: la settima (Re) al basso' },
        { notes: 'Mib Fa La Do', name: 'Fa settima terza inversione', symbol: 'F7/E', explanation: 'Terza inversione: la settima (Mib) al basso' },
        { notes: 'Fa Sol Si Re', name: 'Sol settima terza inversione', symbol: 'G7/F#', explanation: 'Terza inversione: la settima (Fa) al basso' },
        { notes: 'Sol La Do# Mi', name: 'La settima terza inversione', symbol: 'A7/G#', explanation: 'Terza inversione: la settima (Sol) al basso' },
        { notes: 'Lab Sib Re Fa', name: 'Si bemolle settima terza inversione', symbol: 'Bb7/A', explanation: 'Terza inversione: la settima (Lab) al basso' },
        { notes: 'La Si Re# Fa#', name: 'Si settima terza inversione', symbol: 'B7/A#', explanation: 'Terza inversione: la settima (La) al basso' },
        
        // Inversioni di accordi di nona (quarta inversione)
        { notes: 'Re Do Mi Sol Sib', name: 'Do nona quarta inversione', symbol: 'C9/D', explanation: 'Quarta inversione: la nona (Re) al basso' },
        { notes: 'Re# Do# Mi# Sol# Si', name: 'Do diesis nona quarta inversione', symbol: 'C#9/D#', explanation: 'Quarta inversione: la nona (Re#) al basso' },
        { notes: 'Mib Reb Fa Lab Dob', name: 'Re bemolle nona quarta inversione', symbol: 'Db9/Eb', explanation: 'Quarta inversione: la nona (Mib) al basso' },
        { notes: 'Mi Re Fa# La Do', name: 'Re nona quarta inversione', symbol: 'D9/E', explanation: 'Quarta inversione: la nona (Mi) al basso' },
        { notes: 'Fa# Mi Sol# Si Re', name: 'Mi nona quarta inversione', symbol: 'E9/F#', explanation: 'Quarta inversione: la nona (Fa#) al basso' },
        { notes: 'Sol Fa La Do Mib', name: 'Fa nona quarta inversione', symbol: 'F9/G', explanation: 'Quarta inversione: la nona (Sol) al basso' },
        { notes: 'Sol# Fa# La# Do# Mi', name: 'Fa diesis nona quarta inversione', symbol: 'F#9/G#', explanation: 'Quarta inversione: la nona (Sol#) al basso' },
        { notes: 'Lab Solb Sib Reb Fab', name: 'Sol bemolle nona quarta inversione', symbol: 'Gb9/Ab', explanation: 'Quarta inversione: la nona (Lab) al basso' },
        { notes: 'La Sol Si Re Fa', name: 'Sol nona quarta inversione', symbol: 'G9/A', explanation: 'Quarta inversione: la nona (La) al basso' },
        { notes: 'Do Sib Re Fa Lab', name: 'Si bemolle nona quarta inversione', symbol: 'Bb9/C', explanation: 'Quarta inversione: la nona (Do) al basso' },
        { notes: 'Do# Si Re# Fa# La', name: 'Si nona quarta inversione', symbol: 'B9/C#', explanation: 'Quarta inversione: la nona (Do#) al basso' }
      ]
    },
    10: { // Livello 10: Solo accordi di nona (tutti i 12 accordi)
      questionsPerRound: 8,
      chords: [
        { notes: 'Do Mi Sol Sib Re', name: 'Do nona', symbol: 'C9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Do# Mi# Sol# Si Re#', name: 'Do diesis nona', symbol: 'C#9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Reb Fa Lab Dob Mib', name: 'Re bemolle nona', symbol: 'Db9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Re Fa# La Do Mi', name: 'Re nona', symbol: 'D9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Mib Sol Sib Reb Fa', name: 'Mi bemolle nona', symbol: 'Eb9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Mi Sol# Si Re Fa#', name: 'Mi nona', symbol: 'E9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Fa La Do Mib Sol', name: 'Fa nona', symbol: 'F9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Fa# La# Do# Mi Sol#', name: 'Fa diesis nona', symbol: 'F#9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Solb Sib Reb Fab Lab', name: 'Sol bemolle nona', symbol: 'Gb9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Sol Si Re Fa La', name: 'Sol nona', symbol: 'G9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Lab Do Mib Solb Sib', name: 'La bemolle nona', symbol: 'Ab9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'La Do# Mi Sol Si', name: 'La nona', symbol: 'A9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Sib Re Fa Lab Do', name: 'Si bemolle nona', symbol: 'Bb9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Si Re# Fa# La Do#', name: 'Si nona', symbol: 'B9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' }
      ]
    },
    11: { // Livello 11: Accordi sospesi (sus2 e sus4)
      questionsPerRound: 8,
      chords: [
        // Sus2 - tutti i 12 accordi
        { notes: 'Do Re Sol', name: 'Do sospeso seconda', symbol: 'Csus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        { notes: 'Do# Re# Sol#', name: 'Do diesis sospeso seconda', symbol: 'C#sus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        { notes: 'Reb Mib Lab', name: 'Re bemolle sospeso seconda', symbol: 'Dbsus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        { notes: 'Re Mi La', name: 'Re sospeso seconda', symbol: 'Dsus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        { notes: 'Mib Fa Sib', name: 'Mi bemolle sospeso seconda', symbol: 'Ebsus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        { notes: 'Mi Fa# Si', name: 'Mi sospeso seconda', symbol: 'Esus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        { notes: 'Fa Sol Do', name: 'Fa sospeso seconda', symbol: 'Fsus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        { notes: 'Fa# Sol# Do#', name: 'Fa diesis sospeso seconda', symbol: 'F#sus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        { notes: 'Solb Lab Reb', name: 'Sol bemolle sospeso seconda', symbol: 'Gbsus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        { notes: 'Sol La Re', name: 'Sol sospeso seconda', symbol: 'Gsus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        { notes: 'Lab Sib Mib', name: 'La bemolle sospeso seconda', symbol: 'Absus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        { notes: 'La Si Mi', name: 'La sospeso seconda', symbol: 'Asus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        { notes: 'Sib Do Fa', name: 'Si bemolle sospeso seconda', symbol: 'Bbsus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        { notes: 'Si Do# Fa#', name: 'Si sospeso seconda', symbol: 'Bsus2', explanation: 'Accordo sospeso: seconda al posto della terza' },
        
        // Sus4 - tutti i 12 accordi
        { notes: 'Do Fa Sol', name: 'Do sospeso quarta', symbol: 'Csus4', explanation: 'Accordo sospeso: quarta al posto della terza' },
        { notes: 'Do# Fa# Sol#', name: 'Do diesis sospeso quarta', symbol: 'C#sus4', explanation: 'Accordo sospeso: quarta al posto della terza' },
        { notes: 'Reb Solb Lab', name: 'Re bemolle sospeso quarta', symbol: 'Dbsus4', explanation: 'Accordo sospeso: quarta al posto della terza' },
        { notes: 'Re Sol La', name: 'Re sospeso quarta', symbol: 'Dsus4', explanation: 'Accordo sospeso: quarta al posto della terza' },
        { notes: 'Mib Lab Sib', name: 'Mi bemolle sospeso quarta', symbol: 'Ebsus4', explanation: 'Accordo sospeso: quarta al posto della terza' },
        { notes: 'Mi La Si', name: 'Mi sospeso quarta', symbol: 'Esus4', explanation: 'Accordo sospeso: quarta al posto della terza' },
        { notes: 'Fa Sib Do', name: 'Fa sospeso quarta', symbol: 'Fsus4', explanation: 'Accordo sospeso: quarta al posto della terza' },
        { notes: 'Fa# Si Do#', name: 'Fa diesis sospeso quarta', symbol: 'F#sus4', explanation: 'Accordo sospeso: quarta al posto della terza' },
        { notes: 'Solb Dob Reb', name: 'Sol bemolle sospeso quarta', symbol: 'Gbsus4', explanation: 'Accordo sospeso: quarta al posto della terza' },
        { notes: 'Sol Do Re', name: 'Sol sospeso quarta', symbol: 'Gsus4', explanation: 'Accordo sospeso: quarta al posto della terza' },
        { notes: 'Lab Reb Mib', name: 'La bemolle sospeso quarta', symbol: 'Absus4', explanation: 'Accordo sospeso: quarta al posto della terza' },
        { notes: 'La Re Mi', name: 'La sospeso quarta', symbol: 'Asus4', explanation: 'Accordo sospeso: quarta al posto della terza' },
        { notes: 'Sib Mib Fa', name: 'Si bemolle sospeso quarta', symbol: 'Bbsus4', explanation: 'Accordo sospeso: quarta al posto della terza' },
        { notes: 'Si Mi Fa#', name: 'Si sospeso quarta', symbol: 'Bsus4', explanation: 'Accordo sospeso: quarta al posto della terza' }
      ]
    },
    12: { // Livello 12: Accordi con note aggiunte (add2 e add9)
      questionsPerRound: 8,
      chords: [
        // Add2 - tutti i 12 accordi
        { notes: 'Do Re Mi Sol', name: 'Do aggiunta seconda', symbol: 'Cadd2', explanation: 'Triade maggiore con seconda aggiunta' },
        { notes: 'Do# Re# Mi# Sol#', name: 'Do diesis aggiunta seconda', symbol: 'C#add2', explanation: 'Triade maggiore con seconda aggiunta' },
        { notes: 'Reb Mib Fa Lab', name: 'Re bemolle aggiunta seconda', symbol: 'Dbadd2', explanation: 'Triade maggiore con seconda aggiunta' },
        { notes: 'Re Mi Fa# La', name: 'Re aggiunta seconda', symbol: 'Dadd2', explanation: 'Triade maggiore con seconda aggiunta' },
        { notes: 'Mib Fa Sol Sib', name: 'Mi bemolle aggiunta seconda', symbol: 'Ebadd2', explanation: 'Triade maggiore con seconda aggiunta' },
        { notes: 'Mi Fa# Sol# Si', name: 'Mi aggiunta seconda', symbol: 'Eadd2', explanation: 'Triade maggiore con seconda aggiunta' },
        { notes: 'Fa Sol La Do', name: 'Fa aggiunta seconda', symbol: 'Fadd2', explanation: 'Triade maggiore con seconda aggiunta' },
        { notes: 'Fa# Sol# La# Do#', name: 'Fa diesis aggiunta seconda', symbol: 'F#add2', explanation: 'Triade maggiore con seconda aggiunta' },
        { notes: 'Solb Lab Sib Reb', name: 'Sol bemolle aggiunta seconda', symbol: 'Gbadd2', explanation: 'Triade maggiore con seconda aggiunta' },
        { notes: 'Sol La Si Re', name: 'Sol aggiunta seconda', symbol: 'Gadd2', explanation: 'Triade maggiore con seconda aggiunta' },
        { notes: 'Lab Sib Do Mib', name: 'La bemolle aggiunta seconda', symbol: 'Abadd2', explanation: 'Triade maggiore con seconda aggiunta' },
        { notes: 'La Si Do# Mi', name: 'La aggiunta seconda', symbol: 'Aadd2', explanation: 'Triade maggiore con seconda aggiunta' },
        { notes: 'Sib Do Re Fa', name: 'Si bemolle aggiunta seconda', symbol: 'Bbadd2', explanation: 'Triade maggiore con seconda aggiunta' },
        { notes: 'Si Do# Re# Fa#', name: 'Si aggiunta seconda', symbol: 'Badd2', explanation: 'Triade maggiore con seconda aggiunta' },
        
        // Add9 - tutti i 12 accordi
        { notes: 'Do Mi Sol Re', name: 'Do aggiunta nona', symbol: 'Cadd9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' },
        { notes: 'Do# Mi# Sol# Re#', name: 'Do diesis aggiunta nona', symbol: 'C#add9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' },
        { notes: 'Reb Fa Lab Mib', name: 'Re bemolle aggiunta nona', symbol: 'Dbadd9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' },
        { notes: 'Re Fa# La Mi', name: 'Re aggiunta nona', symbol: 'Dadd9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' },
        { notes: 'Mib Sol Sib Fa', name: 'Mi bemolle aggiunta nona', symbol: 'Ebadd9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' },
        { notes: 'Mi Sol# Si Fa#', name: 'Mi aggiunta nona', symbol: 'Eadd9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' },
        { notes: 'Fa La Do Sol', name: 'Fa aggiunta nona', symbol: 'Fadd9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' },
        { notes: 'Fa# La# Do# Sol#', name: 'Fa diesis aggiunta nona', symbol: 'F#add9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' },
        { notes: 'Solb Sib Reb Lab', name: 'Sol bemolle aggiunta nona', symbol: 'Gbadd9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' },
        { notes: 'Sol Si Re La', name: 'Sol aggiunta nona', symbol: 'Gadd9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' },
        { notes: 'Lab Do Mib Sib', name: 'La bemolle aggiunta nona', symbol: 'Abadd9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' },
        { notes: 'La Do# Mi Si', name: 'La aggiunta nona', symbol: 'Aadd9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' },
        { notes: 'Sib Re Fa Do', name: 'Si bemolle aggiunta nona', symbol: 'Bbadd9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' },
        { notes: 'Si Re# Fa# Do#', name: 'Si aggiunta nona', symbol: 'Badd9', explanation: 'Triade maggiore con nona aggiunta (senza settima)' }
      ]
    },
    13: { // Livello 13: Mix di tutto (livello finale)
      questionsPerRound: 10,
      chords: []  // Verrà popolato dinamicamente nella funzione getLevelChords
    }
  };

  // Funzione per verificare se un accordo è comune o raro
  const isCommonChord = (chord) => {
    const symbol = chord.symbol;
    // Estrae la nota fondamentale
    let rootNote = symbol.replace(/[^A-G#b]/g, '');
    if (rootNote.includes('#')) {
      rootNote = rootNote.substring(0, 2);
    } else if (rootNote.includes('b')) {
      rootNote = rootNote.substring(0, 2);
    } else {
      rootNote = rootNote.charAt(0);
    }
    
    // Tasti bianchi sono sempre comuni
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    if (whiteKeys.includes(rootNote)) {
      return true;
    }
    
    // Tasti neri comuni: Eb (Mib), Bb (Sib), Ab (Lab)
    const commonBlackKeys = ['Eb', 'Bb', 'Ab'];
    return commonBlackKeys.includes(rootNote);
  };

  // Funzione per ottenere gli accordi del livello corrente
  const getLevelChords = (levelNum) => {
    if (levelNum === 13) {
      // Livello 13: Mix di tutto - seleziona accordi da tutti i livelli
      const allChords = [];
      
      // Aggiunge alcuni accordi da ogni livello precedente
      for (let i = 1; i <= 12; i++) {
        const levelChords = chordDatabase[i]?.chords || [];
        if (levelChords.length > 0) {
          // Prende i primi 3-4 accordi da ogni livello per varietà
          const count = Math.min(4, levelChords.length);
          allChords.push(...levelChords.slice(0, count));
        }
      }
      
      // Mischia gli accordi per varietà
      return allChords.sort(() => Math.random() - 0.5);
    }
    
    return chordDatabase[levelNum]?.chords || [];
  };

  // Funzione per filtrare accordi in base ai tasti
  const filterChordsByKeys = (chords, filter = keyFilter) => {
    if (filter === 'entrambi') return chords;
    
    // Mappa per convertire simboli inglesi in note italiane
    const noteMap = {
      'C': 'Do', 'C#': 'Do#', 'Db': 'Reb',
      'D': 'Re', 'D#': 'Re#', 'Eb': 'Mib',
      'E': 'Mi', 'F': 'Fa', 'F#': 'Fa#',
      'Gb': 'Solb', 'G': 'Sol', 'G#': 'Sol#',
      'Ab': 'Lab', 'A': 'La', 'A#': 'La#',
      'Bb': 'Sib', 'B': 'Si'
    };
    
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // Simboli inglesi per tasti bianchi
    const blackKeys = ['C#', 'Db', 'D#', 'Eb', 'F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb']; // Simboli per tasti neri
    
    return chords.filter(chord => {
      // Estrae la nota fondamentale dal simbolo (es: da "Cmaj7" estrae "C", da "C#7" estrae "C#")
      let rootNote = chord.symbol.replace(/[^A-G#b]/g, '');
      
      // Gestisce casi speciali per note con diesis/bemolle
      if (rootNote.includes('#')) {
        rootNote = rootNote.substring(0, 2); // Prende i primi 2 caratteri (es: "C#")
      } else if (rootNote.includes('b')) {
        rootNote = rootNote.substring(0, 2); // Prende i primi 2 caratteri (es: "Db")
      } else {
        rootNote = rootNote.charAt(0); // Prende solo il primo carattere (es: "C")
      }
      
      if (filter === 'bianchi') {
        return whiteKeys.includes(rootNote);
      } else if (filter === 'neri') {
        return blackKeys.includes(rootNote);
      }
      return true;
    });
  };

  // Funzione per ottenere accordi filtrati
  const getFilteredChords = () => {
    const levelChords = getLevelChords(level);
    return filterChordsByKeys(levelChords);
  };

  // Teoria degli accordi per la sezione Impara
  const theoryDatabase = {
    'major-minor': {
      title: 'Accordi Maggiori e Minori',
      content: (
        <div>
          <h3 className="text-xl font-bold mb-2">Triadi Maggiori</h3>
          <p className="mb-2">Una triade maggiore è formata da tre note:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Fondamentale:</strong> la nota che dà il nome all'accordo</li>
            <li><strong>Terza maggiore:</strong> 4 semitoni sopra la fondamentale</li>
            <li><strong>Quinta giusta:</strong> 7 semitoni sopra la fondamentale</li>
          </ul>
          <p className="mb-4">Esempio: Do maggiore (C) = Do + Mi + Sol</p>
          
          <h3 className="text-xl font-bold mb-2">Triadi Minori</h3>
          <p className="mb-2">Una triade minore differisce dalla maggiore per la terza:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Fondamentale:</strong> la nota che dà il nome all'accordo</li>
            <li><strong>Terza minore:</strong> 3 semitoni sopra la fondamentale</li>
            <li><strong>Quinta giusta:</strong> 7 semitoni sopra la fondamentale</li>
          </ul>
          <p className="mb-4">Esempio: La minore (Am) = La + Do + Mi</p>
          
          <h3 className="text-xl font-bold mb-2">Relazione tra Maggiore e Minore</h3>
          <p>Ogni tonalità maggiore ha una relativa minore che si trova una terza minore sotto (o una sesta maggiore sopra). Condividono le stesse note ma con centri tonali diversi.</p>
        </div>
      )
    },
    'augmented-diminished': {
      title: 'Accordi Aumentati e Diminuiti',
      content: (
        <div>
          <h3 className="text-xl font-bold mb-2">Accordi Diminuiti (°)</h3>
          <p className="mb-2">Una triade con due terze minori sovrapposte:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Fondamentale</strong></li>
            <li><strong>Terza minore:</strong> 3 semitoni sopra</li>
            <li><strong>Quinta diminuita:</strong> 6 semitoni sopra (invece di 7)</li>
          </ul>
          <p className="mb-2">Esempio: C° = Do + Mib + Solb</p>
          <p className="mb-4">Crea forte tensione e instabilità</p>
          
          <h3 className="text-xl font-bold mb-2">Accordi Aumentati (+)</h3>
          <p className="mb-2">Una triade con due terze maggiori sovrapposte:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Fondamentale</strong></li>
            <li><strong>Terza maggiore:</strong> 4 semitoni sopra</li>
            <li><strong>Quinta aumentata:</strong> 8 semitoni sopra (invece di 7)</li>
          </ul>
          <p className="mb-2">Esempio: C+ = Do + Mi + Sol#</p>
          <p>Suono misterioso e ambiguo</p>
        </div>
      )
    },
    'sevenths': {
      title: 'Accordi di Settima',
      content: (
        <div>
          <h3 className="text-xl font-bold mb-2">Settima di Dominante (7)</h3>
          <p className="mb-2">Aggiunge una settima minore alla triade maggiore:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Triade maggiore + settima minore (10 semitoni dalla fondamentale)</li>
            <li>Esempio: C7 = Do + Mi + Sol + Sib</li>
            <li>Crea tensione che risolve naturalmente</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Settima Maggiore (maj7)</h3>
          <p className="mb-2">Aggiunge una settima maggiore alla triade maggiore:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Triade maggiore + settima maggiore (11 semitoni dalla fondamentale)</li>
            <li>Esempio: Cmaj7 = Do + Mi + Sol + Si</li>
            <li>Suono più "aperto" e moderno</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Settima Minore (m7)</h3>
          <p className="mb-2">Aggiunge una settima minore alla triade minore:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Triade minore + settima minore</li>
            <li>Esempio: Am7 = La + Do + Mi + Sol</li>
            <li>Molto usato nel jazz e nella musica moderna</li>
          </ul>
        </div>
      )
    },
    'sixths': {
      title: 'Accordi di Sesta',
      content: (
        <div>
          <h3 className="text-xl font-bold mb-2">Accordi di Sesta (6)</h3>
          <p className="mb-2">Una triade maggiore con l'aggiunta della sesta maggiore:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Triade maggiore + sesta maggiore (9 semitoni dalla fondamentale)</li>
            <li>Esempio: C6 = Do + Mi + Sol + La</li>
            <li>Alternativa più "leggera" alla settima maggiore</li>
            <li>Molto usato nel jazz e nella bossa nova</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Accordi di Sesta Minore (m6)</h3>
          <p className="mb-2">Una triade minore con l'aggiunta della sesta maggiore:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Triade minore + sesta maggiore</li>
            <li>Esempio: Am6 = La + Do + Mi + Fa#</li>
            <li>Suono dolce e nostalgico</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Differenza con maj7</h3>
          <p>Mentre maj7 aggiunge la settima maggiore, l'accordo di sesta aggiunge la sesta maggiore, creando un suono più aperto e meno dissonante.</p>
        </div>
      )
    },
    'inversions': {
      title: 'Rivolti/Inversioni (Slash Chords)',
      content: (
        <div>
          <h3 className="text-xl font-bold mb-2">Cosa sono i Rivolti/Inversioni?</h3>
          <p className="mb-2">Un'inversione (o rivolto) è quando una nota diversa dalla fondamentale si trova al basso.</p>
          <p className="mb-4"><strong>📝 Nota:</strong> "Rivolto" e "Inversione" sono la stessa cosa, solo due nomi diversi!</p>
          
          <h3 className="text-xl font-bold mb-2">Prima Inversione (Primo Rivolto)</h3>
          <p className="mb-2">La terza dell'accordo è al basso:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>C/E = Mi + Sol + Do (invece di Do + Mi + Sol)</li>
            <li>La terza (Mi) è la nota più bassa</li>
            <li>Si può chiamare: "Do maggiore prima inversione" o "Do maggiore primo rivolto"</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Seconda Inversione (Secondo Rivolto)</h3>
          <p className="mb-2">La quinta dell'accordo è al basso:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>C/G = Sol + Do + Mi</li>
            <li>La quinta (Sol) è la nota più bassa</li>
            <li>Si può chiamare: "Do maggiore seconda inversione" o "Do maggiore secondo rivolto"</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Terza Inversione (Terzo Rivolto)</h3>
          <p className="mb-2">Solo per accordi di settima - la settima è al basso:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Cmaj7/B = Si + Do + Mi + Sol</li>
            <li>La settima (Si) è la nota più bassa</li>
            <li>Si può chiamare: "Do settima maggiore terza inversione" o "Do settima maggiore terzo rivolto"</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Utilizzo</h3>
          <p>I rivolti/inversioni creano linee di basso più fluide e movimenti armonici più interessanti.</p>
        </div>
      )
    },
    'ninths': {
      title: 'Accordi di Nona',
      content: (
        <div>
          <h3 className="text-xl font-bold mb-2">Accordi di Nona (9)</h3>
          <p className="mb-2">Estensione dell'accordo di settima con l'aggiunta della nona:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Settima di dominante + nona maggiore (14 semitoni dalla fondamentale)</li>
            <li>Esempio: C9 = Do + Mi + Sol + Sib + Re</li>
            <li>Il Re è la nona (un'ottava più la seconda)</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Nona Maggiore (maj9)</h3>
          <p className="mb-2">Settima maggiore con nona aggiunta:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Settima maggiore + nona maggiore</li>
            <li>Esempio: Cmaj9 = Do + Mi + Sol + Si + Re</li>
            <li>Suono molto aperto e moderno</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Nona Minore (m9)</h3>
          <p className="mb-2">Settima minore con nona aggiunta:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Accordo minore settima + nona maggiore</li>
            <li>Esempio: Am9 = La + Do + Mi + Sol + Si</li>
            <li>Molto usato nel jazz smooth e R&B</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Utilizzo</h3>
          <p className="mb-4">Gli accordi di nona aggiungono colore e complessità armonica. Sono molto usati nel jazz, funk e R&B per creare sonorità più ricche.</p>
        </div>
      )
    },
    'suspended': {
      title: 'Accordi Sospesi (Sus)',
      content: (
        <div>
          <h3 className="text-xl font-bold mb-2">Cosa sono gli Accordi Sospesi?</h3>
          <p className="mb-4">Gli accordi sospesi sostituiscono la terza con un'altra nota, creando tensione che "chiede" risoluzione.</p>
          
          <h3 className="text-xl font-bold mb-2">Accordi Sus2</h3>
          <p className="mb-2">La terza è sostituita dalla seconda:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Struttura:</strong> Fondamentale + Seconda + Quinta</li>
            <li>Esempio: Csus2 = Do + Re + Sol</li>
            <li>Suono aperto e "aereo"</li>
            <li>Molto usato nel rock e pop moderno</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Accordi Sus4</h3>
          <p className="mb-2">La terza è sostituita dalla quarta:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Struttura:</strong> Fondamentale + Quarta + Quinta</li>
            <li>Esempio: Csus4 = Do + Fa + Sol</li>
            <li>Crea tensione che risolve naturalmente alla terza</li>
            <li>Classico nel rock e nel folk</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Risoluzione</h3>
          <p>Gli accordi sospesi tendono a risolvere verso l'accordo maggiore o minore corrispondente: Csus4 → C o Csus2 → C</p>
        </div>
      )
    },
    'added-tones': {
      title: 'Accordi con Note Aggiunte (Add)',
      content: (
        <div>
          <h3 className="text-xl font-bold mb-2">Cosa sono le Note Aggiunte?</h3>
          <p className="mb-4">Gli accordi "add" aggiungono una nota extra alla triade base senza includere le note intermedie.</p>
          
          <h3 className="text-xl font-bold mb-2">Accordi Add2</h3>
          <p className="mb-2">Aggiunge la seconda alla triade:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Struttura:</strong> Triade + Seconda</li>
            <li>Esempio: Cadd2 = Do + Re + Mi + Sol</li>
            <li>Differenza da sus2: mantiene la terza</li>
            <li>Suono ricco ma non troppo denso</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Accordi Add9</h3>
          <p className="mb-2">Aggiunge la nona alla triade (senza la settima):</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Struttura:</strong> Triade + Nona</li>
            <li>Esempio: Cadd9 = Do + Mi + Sol + Re (ottava superiore)</li>
            <li>Differenza da 9: non include la settima</li>
            <li>Molto popolare nel pop e rock alternativo</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Utilizzo</h3>
          <p>Gli accordi add creano colore armonico senza la complessità e tensione degli accordi di settima completi.</p>
        </div>
      )
    },
    'complex': {
      title: 'Accordi Complessi e Alterati',
      content: (
        <div>
          <h3 className="text-xl font-bold mb-2">Accordi Diminuiti di Settima (dim7)</h3>
          <p className="mb-2">Triade diminuita + settima diminuita:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Esempio: Cdim7 = Do + Mib + Solb + La (=Sibb)</li>
            <li>Simmetrico: ogni nota dista 3 semitoni</li>
            <li>Funzione di passaggio e modulazione</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Accordi Semi-diminuiti (m7b5)</h3>
          <p className="mb-2">Triade diminuita + settima minore:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Esempio: Cm7b5 = Do + Mib + Solb + Sib</li>
            <li>Comune nel jazz e nella musica classica</li>
            <li>Spesso usato nel II grado delle tonalità minori</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Accordi di Undicesima (11)</h3>
          <p className="mb-2">Estensione degli accordi di nona:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Include: 1-3-5-7-9-11</li>
            <li>Esempio: C11 = Do + Mi + Sol + Sib + Re + Fa</li>
            <li>Suono molto ricco e jazzistico</li>
          </ul>
        </div>
      )
    }
  };

  // Funzione per generare suggerimenti sulla struttura dell'accordo
  const getChordStructureHint = (chord) => {
    if (!chord) return '';
    
    const symbol = chord.symbol;
    const name = chord.name;
    
    // Analizza il tipo di accordo senza rivelare la nota fondamentale
    let structureHint = '';
    
    if (symbol.includes('maj7')) {
      structureHint = 'Triade maggiore + settima maggiore';
    } else if (symbol.includes('m7')) {
      structureHint = 'Triade minore + settima minore';
    } else if (symbol.includes('7') && !symbol.includes('maj')) {
      structureHint = 'Triade maggiore + settima minore (dominante)';
    } else if (symbol.includes('6')) {
      structureHint = 'Triade maggiore + sesta maggiore';
    } else if (symbol.includes('9')) {
      structureHint = 'Accordo di settima + nona maggiore';
    } else if (symbol.includes('+')) {
      structureHint = 'Triade aumentata (quinta aumentata)';
    } else if (symbol.includes('°')) {
      structureHint = 'Triade diminuita (quinta diminuita)';
    } else if (symbol.includes('m') && !symbol.includes('maj')) {
      structureHint = 'Triade minore';
    } else if (symbol.includes('/')) {
      const parts = symbol.split('/');
      structureHint = `Inversione con ${parts[1]} al basso`;
    } else {
      structureHint = 'Triade maggiore';
    }
    
    return structureHint;
  };

  // Funzioni per suggerimenti specifici per livello
  const getLevelDescription = (levelNum) => {
    const descriptions = {
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
    return descriptions[levelNum] || 'Accordi Misti';
  };

  const getLevelHint = (levelNum) => {
    const hints = {
      1: 'Tutti accordi maggiori. Esempi: "Do maggiore" o "C", "Fa diesis maggiore" o "F#"',
      2: 'Tutti accordi minori. Esempi: "La minore" o "Am", "Re diesis minore" o "D#m"',
      3: 'Settime di dominante (triade maggiore + settima minore). Esempi: "Do settima" o "C7", "Sol settima" o "G7"',
      4: 'Settime maggiori (triade maggiore + settima maggiore). Esempi: "Do settima maggiore" o "Cmaj7", "Fa settima maggiore" o "Fmaj7"',
      5: 'Settime minori (triade minore + settima minore). Esempi: "La minore settima" o "Am7", "Re minore settima" o "Dm7"',
      6: 'Accordi di sesta (triade maggiore + sesta maggiore). Esempi: "Do maggiore sesta" o "C6", "La bemolle maggiore sesta" o "Ab6"',
      7: 'Accordi diminuiti (terza minore + quinta diminuita). Esempi: "Do diminuito" o "C°", "Si diminuito" o "B°"',
      8: 'Accordi aumentati (terza maggiore + quinta aumentata). Esempi: "Do aumentato" o "C+", "Fa aumentato" o "F+"',
      9: 'Rivolti/Inversioni (nota diversa dalla fondamentale al basso). Esempi: "Do maggiore primo rivolto" o "C/E", "Do maggiore seconda inversione" o "C/G"',
      10: 'Accordi di nona (settima di dominante + nona maggiore). Esempi: "Do nona" o "C9", "Sol nona" o "G9"',
      11: 'Accordi sospesi (seconda o quarta al posto della terza). Esempi: "Do sospeso seconda" o "Csus2", "Sol sospeso quarta" o "Gsus4"',
      12: 'Accordi con note aggiunte (seconda o nona senza settima). Esempi: "Do aggiunta seconda" o "Cadd2", "Fa aggiunta nona" o "Fadd9"',
      13: 'Mix di tutti i tipi di accordi precedenti. Massima varietà!'
    };
    return hints[levelNum] || 'Vari tipi di accordi';
  };

  // Funzioni helper
  const getRandomChord = () => {
    const filteredChords = getFilteredChords();
    if (filteredChords.length === 0) {
      console.error('Nessun accordo disponibile per il livello', level, 'con filtro', keyFilter);
      return null;
    }
    return filteredChords[Math.floor(Math.random() * filteredChords.length)];
  };

  const checkAnswer = (answer, correctName, correctSymbol) => {
    // Normalizza rimuovendo spazi e convertendo in minuscolo, mantenendo caratteri speciali importanti
    const normalize = str => str.toLowerCase().replace(/\s+/g, '').replace(/[^a-zàéèìíîòóù]/g, '');
    const normalizeSymbol = str => str.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9+°øm#/]/g, '');
    
    const normalizedAnswer = normalize(answer);
    const normalizedName = normalize(correctName);
    const normalizedSymbol = normalizeSymbol(answer);
    const normalizedCorrectSymbol = normalizeSymbol(correctSymbol);
    
    // Controlla corrispondenza esatta per nome o simbolo
    if (normalizedAnswer === normalizedName || normalizedSymbol === normalizedCorrectSymbol) {
      return true;
    }
    
    // Gestisce sinonimi per diminuito e aumentato nei simboli
    const answerWithSynonyms = answer.toLowerCase()
      .replace(/dim/g, '°')     // dim -> °
      .replace(/aug/g, '+');    // aug -> +
    
    const normalizedSynonymSymbol = normalizeSymbol(answerWithSynonyms);
    if (normalizedSynonymSymbol === normalizedCorrectSymbol) {
      return true;
    }
    
    // Varianti alternative per rendere più flessibile
    const alternativeChecks = [
      // Rimuove "accordo" se presente
      normalize(answer.replace(/accordo\s+/gi, '')),
      // Gestisce "Do#" vs "Do diesis"
      normalize(answer.replace(/diesis/gi, '#').replace(/bemolle/gi, 'b')),
      // Gestisce abbreviazioni comuni
      normalize(answer.replace(/magg/gi, 'maggiore').replace(/min/gi, 'minore')),
      
      // Nuovi formati per SESTE - es: "mi maggiore 6", "mi maggiore sesta", "mi 6"
      normalize(answer.replace(/\s*(maggiore|minore)\s*6\s*/gi, ' $1 sesta')),
      normalize(answer.replace(/\s*6\s*$/gi, ' sesta')),
      
      // Nuovi formati per SETTIME - es: "do maggiore 7", "do 7", "do minore 7"
      normalize(answer.replace(/\s*(maggiore)\s*7\s*$/gi, ' settima maggiore')),
      normalize(answer.replace(/\s*(minore)\s*7\s*$/gi, ' minore settima')),
      normalize(answer.replace(/\s*7\s*$/gi, ' settima')), // "do 7" -> "do settima"
      
      // Nuovi formati per SETTIME SEMI-DIMINUITE - es: "do 7 dim", "do settima dim"
      normalize(answer.replace(/\s*7\s*dim\s*$/gi, ' minore settima quinta bemolle')),
      normalize(answer.replace(/\s*settima\s*dim\s*$/gi, ' minore settima quinta bemolle')),
      normalize(answer.replace(/\s*settima\s*diminuita\s*$/gi, ' minore settima quinta bemolle')),
      
      // Nuovi formati per SETTIME DIMINUITE - es: "do dim7", "do diminuito settima"
      normalize(answer.replace(/\s*dim7\s*$/gi, ' diminuito settima')),
      normalize(answer.replace(/\s*diminuito\s*7\s*$/gi, ' diminuito settima')),
      
      // Nuovi formati per NONE - es: "do maggiore 9", "do 9", "do minore 9"
      normalize(answer.replace(/\s*(maggiore)\s*9\s*$/gi, ' maggiore nona')),
      normalize(answer.replace(/\s*(minore)\s*9\s*$/gi, ' minore nona')),
      normalize(answer.replace(/\s*9\s*$/gi, ' nona')),
      
      // Nuovi formati per ACCORDI AVANZATI - es: "do aggiunta 9", "do 11"
      normalize(answer.replace(/\s*11\s*$/gi, ' undicesima')),
      normalize(answer.replace(/\s*aggiunta\s*9\s*$/gi, ' aggiunta nona')),
      normalize(answer.replace(/\s*aggiunta\s*2\s*$/gi, ' aggiunta seconda')),
      normalize(answer.replace(/\s*add\s*9\s*$/gi, ' aggiunta nona')),
      normalize(answer.replace(/\s*add\s*2\s*$/gi, ' aggiunta seconda')),
      
      // Gestisce rivolti/inversioni come sinonimi
      normalize(answer.replace(/primo\s+rivolto/gi, 'prima inversione')),
      normalize(answer.replace(/seconda\s+rivolto/gi, 'seconda inversione')),
      normalize(answer.replace(/terzo\s+rivolto/gi, 'terza inversione')),
      normalize(answer.replace(/prima\s+inversione/gi, 'primo rivolto')),
      normalize(answer.replace(/seconda\s+inversione/gi, 'secondo rivolto')),
      normalize(answer.replace(/terza\s+inversione/gi, 'terzo rivolto')),
    ];
    
    return alternativeChecks.some(alt => alt === normalizedName);
  };

  const getQuestionsPerRound = () => {
    return questionsPerGame;
  };

  const startGame = () => {
    // Verifica se il livello è sbloccato
    if (!unlockedLevels.includes(level)) {
      alert(`Il livello ${level} è bloccato. Completa i livelli precedenti con almeno l'80% per sbloccarlo.`);
      setScreen('settings');
      return;
    }
    
    const filteredChords = getFilteredChords();
    if (filteredChords.length === 0) {
      alert(`Nessun accordo disponibile per il livello ${level} con il filtro "${keyFilter}". Cambia il filtro nelle impostazioni.`);
      setScreen('settings');
      return;
    }
    
    setScreen('game');
    setScore(0);
    setTotalQuestions(0);
    setQuestionsCount(0);
    setGameActive(true);
    
    const firstChord = getRandomChord();
    if (!firstChord) {
      alert('Errore nel caricamento degli accordi. Riprova.');
      setScreen('menu');
      return;
    }
    
    setCurrentChord(firstChord);
    setUserAnswer('');
    setShowSolution(false);
  };

  const submitAnswer = () => {
    if (!showSolution) {
      const correct = checkAnswer(userAnswer, currentChord.name, currentChord.symbol);
      if (correct) setScore(score + 1);
      setTotalQuestions(totalQuestions + 1);
      setQuestionsCount(questionsCount + 1);
      setShowSolution(true);
    } else {
      if (questionsCount >= getQuestionsPerRound()) {
        setGameActive(false);
        setScreen('results');
      } else {
        const nextChord = getRandomChord();
        if (!nextChord) {
          alert('Errore nel caricamento degli accordi. Riprova.');
          setScreen('menu');
          return;
        }
        setCurrentChord(nextChord);
        setUserAnswer('');
        setShowSolution(false);
      }
    }
  };

  const getLearnChords = () => {
    switch (learnCategory) {
      case 'major-minor': 
        return [...chordDatabase[1].chords, ...chordDatabase[2].chords];
      case 'sevenths': 
        return [...chordDatabase[3].chords, ...chordDatabase[4].chords, ...chordDatabase[5].chords];
      case 'augmented-diminished': 
        return [...chordDatabase[7].chords, ...chordDatabase[8].chords];
      case 'sixths':
        return chordDatabase[6].chords;
      case 'inversions':
        return chordDatabase[9].chords;
      case 'ninths':
        return chordDatabase[10].chords;
      case 'suspended':
        // Accordi sospesi completi dal CSV
        return [
          { notes: "Do Re Sol", name: "Do sospeso seconda", symbol: "Csus2", explanation: "Accordo sospeso con seconda al posto della terza" },
          { notes: "Do Fa Sol", name: "Do sospeso quarta", symbol: "Csus4", explanation: "Accordo sospeso con quarta al posto della terza" },
          { notes: "Do# Re# Sol#", name: "Do diesis sospeso seconda", symbol: "C#sus2", explanation: "Accordo sospeso con seconda al posto della terza" },
          { notes: "Do# Fa# Sol#", name: "Do diesis sospeso quarta", symbol: "C#sus4", explanation: "Accordo sospeso con quarta al posto della terza" },
          { notes: "Re Mi La", name: "Re sospeso seconda", symbol: "Dsus2", explanation: "Accordo sospeso con seconda al posto della terza" },
          { notes: "Re Sol La", name: "Re sospeso quarta", symbol: "Dsus4", explanation: "Accordo sospeso con quarta al posto della terza" },
          { notes: "Mib Fa Sib", name: "Mi bemolle sospeso seconda", symbol: "Ebsus2", explanation: "Accordo sospeso con seconda al posto della terza" },
          { notes: "Mib Lab Sib", name: "Mi bemolle sospeso quarta", symbol: "Ebsus4", explanation: "Accordo sospeso con quarta al posto della terza" },
          { notes: "Mi Fa# Si", name: "Mi sospeso seconda", symbol: "Esus2", explanation: "Accordo sospeso con seconda al posto della terza" },
          { notes: "Mi La Si", name: "Mi sospeso quarta", symbol: "Esus4", explanation: "Accordo sospeso con quarta al posto della terza" },
          { notes: "Fa Sol Do", name: "Fa sospeso seconda", symbol: "Fsus2", explanation: "Accordo sospeso con seconda al posto della terza" },
          { notes: "Fa Sib Do", name: "Fa sospeso quarta", symbol: "Fsus4", explanation: "Accordo sospeso con quarta al posto della terza" },
          { notes: "Fa# Sol# Do#", name: "Fa diesis sospeso seconda", symbol: "F#sus2", explanation: "Accordo sospeso con seconda al posto della terza" },
          { notes: "Fa# Si Do#", name: "Fa diesis sospeso quarta", symbol: "F#sus4", explanation: "Accordo sospeso con quarta al posto della terza" },
          { notes: "Sol La Re", name: "Sol sospeso seconda", symbol: "Gsus2", explanation: "Accordo sospeso con seconda al posto della terza" },
          { notes: "Sol Do Re", name: "Sol sospeso quarta", symbol: "Gsus4", explanation: "Accordo sospeso con quarta al posto della terza" },
          { notes: "Lab Sib Mib", name: "La bemolle sospeso seconda", symbol: "Absus2", explanation: "Accordo sospeso con seconda al posto della terza" },
          { notes: "Lab Reb Mib", name: "La bemolle sospeso quarta", symbol: "Absus4", explanation: "Accordo sospeso con quarta al posto della terza" },
          { notes: "La Si Mi", name: "La sospeso seconda", symbol: "Asus2", explanation: "Accordo sospeso con seconda al posto della terza" },
          { notes: "La Re Mi", name: "La sospeso quarta", symbol: "Asus4", explanation: "Accordo sospeso con quarta al posto della terza" },
          { notes: "Sib Do Fa", name: "Si bemolle sospeso seconda", symbol: "Bbsus2", explanation: "Accordo sospeso con seconda al posto della terza" },
          { notes: "Sib Mib Fa", name: "Si bemolle sospeso quarta", symbol: "Bbsus4", explanation: "Accordo sospeso con quarta al posto della terza" },
          { notes: "Si Do# Fa#", name: "Si sospeso seconda", symbol: "Bsus2", explanation: "Accordo sospeso con seconda al posto della terza" },
          { notes: "Si Mi Fa#", name: "Si sospeso quarta", symbol: "Bsus4", explanation: "Accordo sospeso con quarta al posto della terza" }
        ];
      case 'added-tones':
        // Accordi con note aggiunte completi dal CSV
        return [
          { notes: "Do Re Mi Sol", name: "Do aggiunta seconda", symbol: "Cadd2", explanation: "Triade maggiore con seconda aggiunta" },
          { notes: "Do Mi Sol Re", name: "Do aggiunta nona", symbol: "Cadd9", explanation: "Triade maggiore con nona aggiunta (senza settima)" },
          { notes: "Do# Re# Mi# Sol#", name: "Do diesis aggiunta seconda", symbol: "C#add2", explanation: "Triade maggiore con seconda aggiunta" },
          { notes: "Do# Mi# Sol# Re#", name: "Do diesis aggiunta nona", symbol: "C#add9", explanation: "Triade maggiore con nona aggiunta (senza settima)" },
          { notes: "Re Mi Fa# La", name: "Re aggiunta seconda", symbol: "Dadd2", explanation: "Triade maggiore con seconda aggiunta" },
          { notes: "Re Fa# La Mi", name: "Re aggiunta nona", symbol: "Dadd9", explanation: "Triade maggiore con nona aggiunta (senza settima)" },
          { notes: "Mib Fa Sol Sib", name: "Mi bemolle aggiunta seconda", symbol: "Ebadd2", explanation: "Triade maggiore con seconda aggiunta" },
          { notes: "Mib Sol Sib Fa", name: "Mi bemolle aggiunta nona", symbol: "Ebadd9", explanation: "Triade maggiore con nona aggiunta (senza settima)" },
          { notes: "Mi Fa# Sol# Si", name: "Mi aggiunta seconda", symbol: "Eadd2", explanation: "Triade maggiore con seconda aggiunta" },
          { notes: "Mi Sol# Si Fa#", name: "Mi aggiunta nona", symbol: "Eadd9", explanation: "Triade maggiore con nona aggiunta (senza settima)" },
          { notes: "Fa Sol La Do", name: "Fa aggiunta seconda", symbol: "Fadd2", explanation: "Triade maggiore con seconda aggiunta" },
          { notes: "Fa La Do Sol", name: "Fa aggiunta nona", symbol: "Fadd9", explanation: "Triade maggiore con nona aggiunta (senza settima)" },
          { notes: "Fa# Sol# La# Do#", name: "Fa diesis aggiunta seconda", symbol: "F#add2", explanation: "Triade maggiore con seconda aggiunta" },
          { notes: "Fa# La# Do# Sol#", name: "Fa diesis aggiunta nona", symbol: "F#add9", explanation: "Triade maggiore con nona aggiunta (senza settima)" },
          { notes: "Sol La Si Re", name: "Sol aggiunta seconda", symbol: "Gadd2", explanation: "Triade maggiore con seconda aggiunta" },
          { notes: "Sol Si Re La", name: "Sol aggiunta nona", symbol: "Gadd9", explanation: "Triade maggiore con nona aggiunta (senza settima)" },
          { notes: "Lab Sib Do Mib", name: "La bemolle aggiunta seconda", symbol: "Abadd2", explanation: "Triade maggiore con seconda aggiunta" },
          { notes: "Lab Do Mib Sib", name: "La bemolle aggiunta nona", symbol: "Abadd9", explanation: "Triade maggiore con nona aggiunta (senza settima)" },
          { notes: "La Si Do# Mi", name: "La aggiunta seconda", symbol: "Aadd2", explanation: "Triade maggiore con seconda aggiunta" },
          { notes: "La Do# Mi Si", name: "La aggiunta nona", symbol: "Aadd9", explanation: "Triade maggiore con nona aggiunta (senza settima)" },
          { notes: "Sib Do Re Fa", name: "Si bemolle aggiunta seconda", symbol: "Bbadd2", explanation: "Triade maggiore con seconda aggiunta" },
          { notes: "Sib Re Fa Do", name: "Si bemolle aggiunta nona", symbol: "Bbadd9", explanation: "Triade maggiore con nona aggiunta (senza settima)" },
          { notes: "Si Do# Re# Fa#", name: "Si aggiunta seconda", symbol: "Badd2", explanation: "Triade maggiore con seconda aggiunta" },
          { notes: "Si Re# Fa# Do#", name: "Si aggiunta nona", symbol: "Badd9", explanation: "Triade maggiore con nona aggiunta (senza settima)" }
        ];
      case 'complex':
        // Accordi complessi completi dal CSV
        return [
          // Accordi di undicesima (11)
          { notes: "Do Mi Sol Sib Re Fa", name: "Do undicesima", symbol: "C11", explanation: "Accordo di undicesima dominante" },
          { notes: "Do Mi Sol Si Re Fa", name: "Do maggiore undicesima", symbol: "Cmaj11", explanation: "Accordo di undicesima maggiore" },
          { notes: "Do Mib Sol Sib Re Fa", name: "Do minore undicesima", symbol: "Cm11", explanation: "Accordo di undicesima minore" },
          { notes: "Re Fa# La Do Mi Sol", name: "Re undicesima", symbol: "D11", explanation: "Accordo di undicesima dominante" },
          { notes: "Sol Si Re Fa La Do", name: "Sol undicesima", symbol: "G11", explanation: "Accordo di undicesima dominante" },
          
          // Accordi diminuiti di settima (dim7)
          { notes: "Do Mib Solb La", name: "Do diminuito settima", symbol: "Cdim7", explanation: "Accordo diminuito con settima diminuita" },
          { notes: "Do# Mi Sol Sib", name: "Do diesis diminuito settima", symbol: "C#dim7", explanation: "Accordo diminuito con settima diminuita" },
          { notes: "Re Fa Lab Si", name: "Re diminuito settima", symbol: "Ddim7", explanation: "Accordo diminuito con settima diminuita" },
          { notes: "Mib Solb La Do", name: "Mi bemolle diminuito settima", symbol: "Ebdim7", explanation: "Accordo diminuito con settima diminuita" },
          { notes: "Mi Sol Sib Reb", name: "Mi diminuito settima", symbol: "Edim7", explanation: "Accordo diminuito con settima diminuita" },
          { notes: "Fa Lab Si Re", name: "Fa diminuito settima", symbol: "Fdim7", explanation: "Accordo diminuito con settima diminuita" },
          { notes: "Fa# La Do Mib", name: "Fa diesis diminuito settima", symbol: "F#dim7", explanation: "Accordo diminuito con settima diminuita" },
          { notes: "Sol Sib Reb Mi", name: "Sol diminuito settima", symbol: "Gdim7", explanation: "Accordo diminuito con settima diminuita" },
          { notes: "Lab Si Re Fa", name: "La bemolle diminuito settima", symbol: "Abdim7", explanation: "Accordo diminuito con settima diminuita" },
          { notes: "La Do Mib Solb", name: "La diminuito settima", symbol: "Adim7", explanation: "Accordo diminuito con settima diminuita" },
          { notes: "Sib Reb Mi Sol", name: "Si bemolle diminuito settima", symbol: "Bbdim7", explanation: "Accordo diminuito con settima diminuita" },
          { notes: "Si Re Fa Lab", name: "Si diminuito settima", symbol: "Bdim7", explanation: "Accordo diminuito con settima diminuita" },
          
          // Accordi semi-diminuiti (m7b5)
          { notes: "Do Mib Solb Sib", name: "Do minore settima quinta bemolle", symbol: "Cm7b5", explanation: "Accordo semi-diminuito" },
          { notes: "Re Fa Lab Do", name: "Re minore settima quinta bemolle", symbol: "Dm7b5", explanation: "Accordo semi-diminuito" },
          { notes: "Mi Sol Sib Re", name: "Mi minore settima quinta bemolle", symbol: "Em7b5", explanation: "Accordo semi-diminuito" },
          { notes: "Fa# La Do Mi", name: "Fa diesis minore settima quinta bemolle", symbol: "F#m7b5", explanation: "Accordo semi-diminuito" },
          { notes: "Sol Sib Reb Fa", name: "Sol minore settima quinta bemolle", symbol: "Gm7b5", explanation: "Accordo semi-diminuito" },
          { notes: "La Do Mib Sol", name: "La minore settima quinta bemolle", symbol: "Am7b5", explanation: "Accordo semi-diminuito" },
          { notes: "Si Re Fa La", name: "Si minore settima quinta bemolle", symbol: "Bm7b5", explanation: "Accordo semi-diminuito" },
          
          // Accordi alterati vari
          { notes: "Do Mi Sol# Sib", name: "Do settima quinta aumentata", symbol: "C7#5", explanation: "Settima dominante con quinta aumentata" },
          { notes: "Do Mi Solb Sib", name: "Do settima quinta diminuita", symbol: "C7b5", explanation: "Settima dominante con quinta diminuita" },
          { notes: "Do Mi Sol Sib Re", name: "Do nona maggiore", symbol: "C9", explanation: "Accordo di nona dominante" },
          { notes: "Do Mib Sol Sib Re", name: "Do minore nona", symbol: "Cm9", explanation: "Accordo di nona minore" },
          { notes: "Do Mi Sol Si Re", name: "Do maggiore nona", symbol: "Cmaj9", explanation: "Accordo di nona maggiore" }
        ];
      default: 
        return chordDatabase[1].chords;
    }
  };

  // Componenti render
  const MenuScreen = () => (
    <div className="text-center space-y-6">
      <h1 className="text-4xl mb-8" style={{ fontFamily: 'Bodoni, "Bodoni MT", "Didot", "Bodoni 72", "Bodoni Old Style", serif' }}>
        <span style={{ fontWeight: 'normal', color: '#2563eb' }}>Mi</span>
        <span style={{ fontStyle: 'italic', color: '#ff0000' }}>La</span>
        <span style={{ fontWeight: 'bold', color: '#2563eb' }}>Sol</span>
      </h1>
      
      {/* Indicatore livello corrente */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Livello attuale:</strong> {level} 
          {!unlockedLevels.includes(level) && <span className="text-red-600"> 🔒 (Bloccato)</span>}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Livelli disponibili: {unlockedLevels.join(', ')}
        </p>
      </div>
      
      <div className="space-y-4">
        <button onClick={() => setScreen('learn')} className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">
          📚 Impara
        </button>
        <button 
          onClick={() => {
            if (!unlockedLevels.includes(level)) {
              alert(`Il livello ${level} è bloccato. Vai nelle impostazioni e seleziona un livello disponibile.`);
              setScreen('settings');
            } else {
              startGame();
            }
          }} 
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
        >
          🎮 Gioca
        </button>
        <button onClick={() => setScreen('glossary')} className="w-full bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 transition-colors">
          📖 Glossario
        </button>
        <button onClick={() => setScreen('settings')} className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors">
          ⚙️ Impostazioni
        </button>
      </div>
    </div>
  );

  const GlossaryScreen = () => (
    <div className="space-y-4 max-h-[500px] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-600">📖 Glossario Minimo</h2>
        <button 
          onClick={() => setScreen('menu')} 
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-purple-800">🎼 Teoria musicale essenziale per costruire gli accordi</p>
        <p className="text-purple-700">Tutti gli elementi fondamentali per capire la siglatura e la struttura degli accordi.</p>
      </div>

      <div className="space-y-4">
        {/* Intervalli */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-lg mb-3 text-blue-600">🎹 Intervalli</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Simbolo</th>
                  <th className="border p-2 text-left">Nome</th>
                  <th className="border p-2 text-left">Distanza dalla fondamentale</th>
                  <th className="border p-2 text-left">Esempio in Do</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">🟢 1</td>
                  <td className="border p-2">Fondamentale</td>
                  <td className="border p-2">—</td>
                  <td className="border p-2">Do</td>
                </tr>
                <tr>
                  <td className="border p-2">🔸 3</td>
                  <td className="border p-2">Terza maggiore</td>
                  <td className="border p-2">2 toni sopra</td>
                  <td className="border p-2">Mi</td>
                </tr>
                <tr>
                  <td className="border p-2">🔹 ♭3</td>
                  <td className="border p-2">Terza minore</td>
                  <td className="border p-2">1 tono e ½ sopra</td>
                  <td className="border p-2">Mib</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quinte */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-lg mb-3 text-green-600">🎵 Quinte</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Simbolo</th>
                  <th className="border p-2 text-left">Nome</th>
                  <th className="border p-2 text-left">Distanza dalla fondamentale</th>
                  <th className="border p-2 text-left">Esempio in Do</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">✅ 5</td>
                  <td className="border p-2">Quinta giusta</td>
                  <td className="border p-2">3 toni e ½</td>
                  <td className="border p-2">Sol</td>
                </tr>
                <tr>
                  <td className="border p-2">🔻 ♭5</td>
                  <td className="border p-2">Quinta diminuita</td>
                  <td className="border p-2">3 toni</td>
                  <td className="border p-2">Sol♭</td>
                </tr>
                <tr>
                  <td className="border p-2">🔺 ♯5</td>
                  <td className="border p-2">Quinta aumentata</td>
                  <td className="border p-2">4 toni</td>
                  <td className="border p-2">Sol♯</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Seste */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-lg mb-3 text-orange-600">🟢 Seste</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Simbolo</th>
                  <th className="border p-2 text-left">Nome</th>
                  <th className="border p-2 text-left">Distanza dalla fondamentale</th>
                  <th className="border p-2 text-left">Esempio in Do</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">6</td>
                  <td className="border p-2">Sesta maggiore</td>
                  <td className="border p-2">4 toni + 1 semitono</td>
                  <td className="border p-2">La</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Settime */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-lg mb-3 text-red-600">🔷 Settime</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Simbolo</th>
                  <th className="border p-2 text-left">Nome</th>
                  <th className="border p-2 text-left">Distanza</th>
                  <th className="border p-2 text-left">Esempio in Do</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">🔹 7</td>
                  <td className="border p-2">Settima minore</td>
                  <td className="border p-2">1 ottava - 1 tono</td>
                  <td className="border p-2">Sib</td>
                </tr>
                <tr>
                  <td className="border p-2">🔸 maj7 / △7</td>
                  <td className="border p-2">Settima maggiore</td>
                  <td className="border p-2">1 ottava - 1 semitono</td>
                  <td className="border p-2">Si</td>
                </tr>
                <tr>
                  <td className="border p-2">🔶 m7b5</td>
                  <td className="border p-2">Settima semi-diminuita</td>
                  <td className="border p-2">1 ottava - 1 tono</td>
                  <td className="border p-2">Sib (con quinta diminuita)</td>
                </tr>
                <tr>
                  <td className="border p-2">🔺 dim7</td>
                  <td className="border p-2">Settima diminuita</td>
                  <td className="border p-2">1 ottava - 1 tono e mezzo</td>
                  <td className="border p-2">La (=Sibb)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Nona */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-lg mb-3 text-indigo-600">✨ Nona</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Simbolo</th>
                  <th className="border p-2 text-left">Nome</th>
                  <th className="border p-2 text-left">Distanza dalla fondamentale</th>
                  <th className="border p-2 text-left">Esempio in Do</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">🔵 9</td>
                  <td className="border p-2">Nona maggiore</td>
                  <td className="border p-2">1 ottava + 1 tono</td>
                  <td className="border p-2">Re</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modificatori */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-lg mb-3 text-pink-600">🔧 Modificatori</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Sigla</th>
                  <th className="border p-2 text-left">Descrizione</th>
                  <th className="border p-2 text-left">Formula</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">sus2 / sus4</td>
                  <td className="border p-2">Sospesi: 3ª sostituita da 2ª o 4ª</td>
                  <td className="border p-2">1–2–5 / 1–4–5</td>
                </tr>
                <tr>
                  <td className="border p-2">add9 / add2</td>
                  <td className="border p-2">Aggiunta: nona o seconda aggiunta (senza settima)</td>
                  <td className="border p-2">1–3–5–9</td>
                </tr>
                <tr>
                  <td className="border p-2">° / dim</td>
                  <td className="border p-2">Diminuito</td>
                  <td className="border p-2">1–♭3–♭5</td>
                </tr>
                <tr>
                  <td className="border p-2">+ / aug</td>
                  <td className="border p-2">Aumentato</td>
                  <td className="border p-2">1–3–♯5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Legenda simboli accordi */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-lg mb-3 text-teal-600">� Legenda simboli accordi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Sigla</th>
                  <th className="border p-2 text-left">Nome accordo</th>
                  <th className="border p-2 text-left">Formula</th>
                  <th className="border p-2 text-left">Esempio (in Do)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">C</td><td className="border p-2">Maggiore</td><td className="border p-2">1–3–5</td><td className="border p-2">Do–Mi–Sol</td></tr>
                <tr><td className="border p-2">C7</td><td className="border p-2">Settima (dominante)</td><td className="border p-2">1–3–5–♭7</td><td className="border p-2">Do–Mi–Sol–Sib</td></tr>
                <tr><td className="border p-2">Cmaj7 / C△7</td><td className="border p-2">Settima maggiore</td><td className="border p-2">1–3–5–7</td><td className="border p-2">Do–Mi–Sol–Si</td></tr>
                <tr><td className="border p-2">Cm7b5</td><td className="border p-2">Settima semi-diminuita</td><td className="border p-2">1–♭3–♭5–♭7</td><td className="border p-2">Do–Mib–Sol♭–Sib</td></tr>
                <tr><td className="border p-2">Cdim7</td><td className="border p-2">Settima diminuita</td><td className="border p-2">1–♭3–♭5–♭♭7</td><td className="border p-2">Do–Mib–Sol♭–La</td></tr>
                <tr><td className="border p-2">C7♭5</td><td className="border p-2">Settima + quinta diminuita</td><td className="border p-2">1–3–♭5–♭7</td><td className="border p-2">Do–Mi–Sol♭–Sib</td></tr>
                <tr><td className="border p-2">Cm</td><td className="border p-2">Minore</td><td className="border p-2">1–♭3–5</td><td className="border p-2">Do–Mib–Sol</td></tr>
                <tr><td className="border p-2">Cm7</td><td className="border p-2">Minore settima</td><td className="border p-2">1–♭3–5–♭7</td><td className="border p-2">Do–Mib–Sol–Sib</td></tr>
                <tr><td className="border p-2">C6</td><td className="border p-2">Sesta maggiore</td><td className="border p-2">1–3–5–6</td><td className="border p-2">Do–Mi–Sol–La</td></tr>
                <tr><td className="border p-2">Cadd9</td><td className="border p-2">Triade + nona</td><td className="border p-2">1–3–5–9</td><td className="border p-2">Do–Mi–Sol–Re</td></tr>
                <tr><td className="border p-2">Csus4</td><td className="border p-2">Sospeso quarta</td><td className="border p-2">1–4–5</td><td className="border p-2">Do–Fa–Sol</td></tr>
                <tr><td className="border p-2">C° / Cdim</td><td className="border p-2">Diminuito</td><td className="border p-2">1–♭3–♭5</td><td className="border p-2">Do–Mib–Sol♭</td></tr>
                <tr><td className="border p-2">C+ / Caug</td><td className="border p-2">Aumentato</td><td className="border p-2">1–3–♯5</td><td className="border p-2">Do–Mi–Sol♯</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tipologia di accordi */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-lg mb-3 text-purple-600">📌 Tipologia di accordi</h3>
          <div className="space-y-1 text-xs">
            <p><strong>C</strong> → triade maggiore</p>
            <p><strong>Cm</strong> → triade minore</p>
            <p><strong>C7</strong> → settima di dominante</p>
            <p><strong>Cmaj7 / C△7</strong> → settima maggiore</p>
            <p><strong>Cm7b5</strong> → settima semi-diminuita</p>
            <p><strong>Cdim7</strong> → settima diminuita</p>
            <p><strong>Cm7</strong> → minore settima</p>
            <p><strong>C6</strong> → sesta</p>
            <p><strong>Csus2 / sus4</strong> → sospesi</p>
            <p><strong>Cadd9 / add2</strong> → aggiunti</p>
            <p><strong>C° / C+</strong> → diminuiti / aumentati</p>
            <p><strong>C7♭5</strong> → semidiminuiti</p>
            <p><strong>C9 / C11</strong> → estesi (livello avanzato)</p>
          </div>
        </div>

        {/* Esempi finali */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Esempi finali (in Do)</h4>
          <div className="space-y-1 text-blue-700 text-xs">
            <p><strong>C</strong> = Do – Mi – Sol (1–3–5)</p>
            <p><strong>Cm</strong> = Do – Mib – Sol (1–♭3–5)</p>
            <p><strong>C7</strong> = Do – Mi – Sol – Sib (1–3–5–♭7)</p>
            <p><strong>Cmaj7 / C△7</strong> = Do – Mi – Sol – Si (1–3–5–7)</p>
            <p><strong>Csus4</strong> = Do – Fa – Sol (1–4–5)</p>
            <p><strong>Cadd9</strong> = Do – Mi – Sol – Re (1–3–5–9)</p>
          </div>
        </div>

        {/* Consiglio pratico */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
          <p className="font-semibold text-green-800">🎯 Consiglio pratico</p>
          <p className="text-green-700 text-xs mt-1">
            Tieni questo glossario come foglio guida da consultare mentre studi gli accordi. 
            I simboli visivi ti aiuteranno a riconoscere rapidamente le strutture anche senza pensarci troppo.
          </p>
          <p className="text-green-700 text-xs mt-2">
            È possibile scaricare il PDF di questa sezione per consultarla offline.
          </p>
          <a 
            href="https://www.sogna.link/glossario-mifasol" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
          >
            📄 Scarica PDF Glossario
          </a>
        </div>
      </div>
    </div>
  );

  const SettingsScreen = () => {
    const availableLevels = [
      { value: 1, label: 'Livello 1 - Solo accordi maggiori', description: 'Accordi maggiori base' },
      { value: 2, label: 'Livello 2 - Solo accordi minori', description: 'Accordi minori base' },
      { value: 3, label: 'Livello 3 - Solo settime di dominante', description: 'Accordi di settima dominante' },
      { value: 4, label: 'Livello 4 - Solo settime maggiori', description: 'Accordi di settima maggiore' },
      { value: 5, label: 'Livello 5 - Solo settime minori', description: 'Accordi di settima minore' },
      { value: 6, label: 'Livello 6 - Solo accordi di sesta', description: 'Accordi con sesta aggiunta' },
      { value: 7, label: 'Livello 7 - Solo accordi diminuiti', description: 'Accordi diminuiti' },
      { value: 8, label: 'Livello 8 - Solo accordi aumentati', description: 'Accordi aumentati' },
      { value: 9, label: 'Livello 9 - Solo inversioni', description: 'Inversioni (slash chords)' },
      { value: 10, label: 'Livello 10 - Solo accordi di nona', description: 'Accordi di nona' },
      { value: 11, label: 'Livello 11 - Solo accordi sospesi', description: 'Accordi sospesi (sus2/sus4)' },
      { value: 12, label: 'Livello 12 - Solo note aggiunte', description: 'Note aggiunte (add2/add9)' },
      { value: 13, label: 'Livello 13 - Mix di tutto', description: 'Tutti i tipi di accordi' }
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Impostazioni</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-medium mb-2">Numero di domande per partita:</label>
            <select value={questionsPerGame} onChange={(e) => setQuestionsPerGame(Number(e.target.value))} className="w-full p-2 border rounded-lg">
              <option value={5}>5 domande</option>
              <option value={10}>10 domande</option>
              <option value={15}>15 domande</option>
              <option value={20}>20 domande</option>
            </select>
          </div>
          
          <div>
            <label className="block text-lg font-medium mb-2">Livello di difficoltà:</label>
            <select 
              value={level} 
              onChange={(e) => {
                const selectedLevel = Number(e.target.value);
                if (unlockedLevels.includes(selectedLevel)) {
                  setLevel(selectedLevel);
                } else {
                  alert(`Il livello ${selectedLevel} è bloccato. Completa i livelli precedenti con almeno l'80% per sbloccarlo.`);
                }
              }} 
              className="w-full p-2 border rounded-lg"
            >
              {availableLevels.map(levelData => (
                <option 
                  key={levelData.value} 
                  value={levelData.value}
                  disabled={!unlockedLevels.includes(levelData.value)}
                  style={{
                    color: unlockedLevels.includes(levelData.value) ? 'black' : 'gray',
                    backgroundColor: unlockedLevels.includes(levelData.value) ? 'white' : '#f0f0f0'
                  }}
                >
                  {unlockedLevels.includes(levelData.value) ? '✅' : '🔒'} {levelData.label}
                </option>
              ))}
            </select>
            {!unlockedLevels.includes(level) && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">
                  🔒 Questo livello è bloccato
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Completa i livelli precedenti con almeno l'80% per sbloccarlo
                </p>
              </div>
            )}
            <div className="mt-2 text-xs text-gray-500">
              Livelli sbloccati: {unlockedLevels.join(', ')}
            </div>
          </div>
        
          
          <div>
            <label className="block text-lg font-medium mb-2">Filtra per tasti:</label>
            <select value={keyFilter} onChange={(e) => setKeyFilter(e.target.value)} className="w-full p-2 border rounded-lg">
              <option value="bianchi">Solo tasti bianchi (Do, Re, Mi, Fa, Sol, La, Si)</option>
              <option value="neri">Solo tasti neri (Do#, Re#, Fa#, Sol#, La#, Sib)</option>
              <option value="entrambi">Entrambi (tasti bianchi e neri)</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => {
                if (!unlockedLevels.includes(level)) {
                  alert(`Il livello ${level} è bloccato. Seleziona un livello disponibile.`);
                } else {
                  startGame();
                }
              }} 
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              🎮 Inizia Partita
            </button>
            <button onClick={() => setScreen('menu')} className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
              ← Torna al Menu
            </button>
          </div>
        </div>
      </div>
    );
  };  const LearnScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showTheory, setShowTheory] = useState(true);
    const [learnKeyFilter, setLearnKeyFilter] = useState('bianchi');
    
    // Funzione per filtrare gli accordi di apprendimento
    const getFilteredLearnChords = () => {
      const baseChords = getLearnChords();
      return filterChordsByKeys(baseChords, learnKeyFilter);
    };
    
    const chords = getFilteredLearnChords();
    const chord = chords[currentIndex];
    const theory = theoryDatabase[learnCategory];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Modalità Studio</h2>
        
        <div className="space-y-4">
          <select value={learnCategory} onChange={(e) => {setLearnCategory(e.target.value); setCurrentIndex(0); setShowTheory(true);}} className="w-full p-2 border rounded-lg">
            <option value="major-minor">Accordi maggiori e minori</option>
            <option value="sevenths">Accordi di settima</option>
            <option value="augmented-diminished">Triadi aumentate e diminuite</option>
            <option value="sixths">Accordi di sesta</option>
            <option value="inversions">Inversioni (Slash Chords)</option>
            <option value="ninths">Accordi di nona</option>
            <option value="suspended">Accordi sospesi (Sus2, Sus4)</option>
            <option value="added-tones">Note aggiunte (Add2, Add9)</option>
            <option value="complex">Accordi complessi e alterati</option>
          </select>
          
          <select value={learnKeyFilter} onChange={(e) => {setLearnKeyFilter(e.target.value); setCurrentIndex(0);}} className="w-full p-2 border rounded-lg bg-blue-50">
            <option value="bianchi">Solo tasti bianchi (Do, Re, Mi, Fa, Sol, La, Si)</option>
            <option value="neri">Solo tasti neri (Do#, Re#, Fa#, Sol#, La#, Sib)</option>
            <option value="entrambi">Tutti i tasti (bianchi e neri)</option>
          </select>
          
          {showTheory && theory ? (
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">{theory.title}</h3>
              <div className="text-gray-700">{theory.content}</div>
              <button 
                onClick={() => setShowTheory(false)} 
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Passa agli Accordi →
              </button>
            </div>
          ) : (
            <>
              {chords.length === 0 ? (
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 text-center">
                    🔍 Nessun accordo disponibile per questa combinazione.<br/>
                    Prova a cambiare il filtro dei tasti.
                  </p>
                </div>
              ) : chord ? (
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                  <div className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                      <h3 className="text-3xl font-bold text-blue-600">{chord.notes}</h3>
                      {!isCommonChord(chord) && (
                        <span 
                          className="text-red-600 text-xl font-bold cursor-help bg-red-100 px-1 py-1 rounded-full border border-red-300 inline-flex items-center justify-center w-6 h-6 relative group" 
                          title="⚠️ Accordo non comune - raramente usato nella pratica musicale"
                        >
                          ⓘ
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                            ⚠️ Accordo raro
                          </span>
                        </span>
                      )}
                    </div>
                    <p className="text-xl font-semibold">{chord.name}</p>
                    <p className="text-lg text-gray-600">Sigla: {chord.symbol}</p>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{chord.explanation}</p>
                  {!isCommonChord(chord) && (
                    <div className="bg-red-50 border border-red-200 p-2 rounded text-xs text-red-700 text-center">
                      ⚠️ Accordo non comune - raramente usato nella pratica musicale
                    </div>
                  )}
                </div>
              ) : null}
              
              {chords.length > 0 && (
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setShowTheory(true)} 
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    ← Teoria
                  </button>
                  <span className="py-2 px-4">{currentIndex + 1} / {chords.length}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} 
                      disabled={currentIndex === 0} 
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      ← Prec
                    </button>
                    <button 
                      onClick={() => setCurrentIndex(Math.min(chords.length - 1, currentIndex + 1))} 
                      disabled={currentIndex === chords.length - 1} 
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      Succ →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <button onClick={() => setScreen('menu')} className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
          Torna al Menu
        </button>
      </div>
    );
  };

  const GameScreen = () => {
    const [showLegend, setShowLegend] = useState(false);
    
    const handleInputChange = (e) => {
      setUserAnswer(e.target.value);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !showSolution) {
        submitAnswer();
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Modalità Gioco - Livello {level}</h2>
          <p className="text-gray-600">Domanda {questionsCount + 1} / {getQuestionsPerRound()}</p>
          <p className="text-sm text-gray-500">Punteggio: {score} / {totalQuestions}</p>
          
          {/* Filtro tasti compatto */}
          <div className="mt-2">
            <select 
              value={keyFilter} 
              onChange={(e) => setKeyFilter(e.target.value)} 
              className="text-xs px-2 py-1 border rounded bg-gray-50 text-gray-600"
            >
              <option value="entrambi">🎹 Tutti i tasti</option>
              <option value="bianchi">⚪ Solo tasti bianchi</option>
              <option value="neri">⚫ Solo tasti neri</option>
            </select>
          </div>
        </div>

        {/* Legenda sigle accordi compatta ed espandibile */}
        <div className="bg-blue-50 rounded-lg">
          <button 
            onClick={() => setShowLegend(!showLegend)}
            className="w-full p-3 text-left text-blue-700 text-sm font-medium flex justify-between items-center hover:bg-blue-100 rounded-lg transition-colors"
          >
            <span>💡 Come rispondere correttamente</span>
            <span className={`transform transition-transform ${showLegend ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {showLegend && (
            <div className="px-3 pb-3 space-y-3">
              {/* Tabella formati di risposta */}
              <div className="text-xs text-blue-700">
                <h4 className="font-semibold mb-3">📚 Formati di risposta accettati:</h4>
                
                <div className="bg-white rounded border border-blue-200 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="p-2 text-left font-semibold border-b border-blue-200">Livello</th>
                        <th className="p-2 text-left font-semibold border-b border-blue-200">Nome Completo (Italiano)</th>
                        <th className="p-2 text-left font-semibold border-b border-blue-200">Sigla Internazionale</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="p-2 font-semibold text-green-700">Base</td>
                        <td className="p-2">"Do maggiore", "La minore"</td>
                        <td className="p-2">"C", "Am"</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-2 font-semibold text-blue-700">Settime</td>
                        <td className="p-2">"Sol settima", "Sol minore settima", "Sol settima maggiore", "Sol 7 dim", "Sol dim7"</td>
                        <td className="p-2">"G7", "Gm7", "Gmaj7", "Gm7b5", "Gdim7"</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-2 font-semibold text-orange-700">Seste</td>
                        <td className="p-2">"Do sesta", "La minore sesta"</td>
                        <td className="p-2">"C6", "Am6"</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-2 font-semibold text-red-700">Speciali</td>
                        <td className="p-2">"Do diminuito", "Fa diesis aumentato"</td>
                        <td className="p-2">"C°/Cdim", "F#+/F#aug"</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-2 font-semibold text-purple-700">Sospesi</td>
                        <td className="p-2">"Do sospeso seconda", "Do sospeso quarta"</td>
                        <td className="p-2">"Csus2", "Csus4"</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold text-indigo-700">Avanzati</td>
                        <td className="p-2">"Do nona", "Do aggiunta nona", "Do undicesima"</td>
                        <td className="p-2">"C9", "Cadd9", "C11"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-yellow-50 p-2 rounded text-yellow-800 mt-3">
                  ⚠️ <strong>Importante:</strong> Gli spazi non contano! "Do#maggiore" = "Do # maggiore" = "Do#  maggiore"<br/>
                  💡 <strong>Abbreviazioni:</strong> Puoi usare "dim" per "°" e "aug" per "+" (es: "Cdim" = "C°")
                </div>
              </div>
            </div>
          )}
        </div>
        
        {currentChord && (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 mb-4">
                <h3 className="text-3xl font-bold text-blue-600">{currentChord.notes}</h3>
                {!isCommonChord(currentChord) && (
                  <span 
                    className="text-red-600 text-xl font-bold cursor-help bg-red-100 px-1 py-1 rounded-full border border-red-300 inline-flex items-center justify-center w-6 h-6 relative group" 
                    title="⚠️ Accordo non comune - raramente usato nella pratica musicale"
                  >
                    ⓘ
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                      ⚠️ Accordo raro
                    </span>
                  </span>
                )}
              </div>
              <p className="text-lg mb-4">Qual è il nome di questo accordo?</p>
              
              {!showSolution ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Es: Do maggiore oppure C"
                    className="w-full p-3 border rounded-lg text-center text-lg"
                    autoComplete="off"
                    autoFocus
                  />
                  <button onClick={submitAnswer} className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    Mostra Soluzione
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${checkAnswer(userAnswer, currentChord.name, currentChord.symbol) ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} border`}>
                    <p className="font-semibold">{checkAnswer(userAnswer, currentChord.name, currentChord.symbol) ? '✅ Corretto!' : '❌ Sbagliato'}</p>
                    <p className="text-lg">Risposta: <strong>{currentChord.name}</strong></p>
                    <p className="text-sm text-gray-600">Sigla: {currentChord.symbol}</p>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{currentChord.explanation}</p>
                  <button onClick={submitAnswer} className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                    Continua
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setScreen('menu')} 
          className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Torna al Menu
        </button>
      </div>
    );
  };

  const ResultsScreen = () => {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = percentage >= 80;
    const perfect = percentage === 100;
    
    // Attiva i coriandoli se si ottiene il 100%
    useEffect(() => {
      if (perfect) {
        setShowConfetti(true);
        // Disattiva i coriandoli dopo 4 secondi
        const timer = setTimeout(() => {
          setShowConfetti(false);
        }, 4000);
        return () => clearTimeout(timer);
      }
    }, [perfect]);
    
    // Sblocca il livello successivo se l'utente ha passato il test
    const handleLevelUp = () => {
      const nextLevel = getNextLevel(level);
      if (passed && nextLevel && !unlockedLevels.includes(nextLevel)) {
        setUnlockedLevels([...unlockedLevels, nextLevel]);
      }
      setLevel(nextLevel);
      setTimeout(() => {
        startGame();
      }, 0);
    };
    
    // Sblocca automaticamente il livello successivo se non è già sbloccato
    useEffect(() => {
      const nextLevel = getNextLevel(level);
      if (passed && nextLevel && !unlockedLevels.includes(nextLevel)) {
        setUnlockedLevels(prev => [...prev, nextLevel]);
      }
    }, [passed, level, unlockedLevels]);
    
    // Funzione per ottenere il prossimo livello disponibile
    const getNextLevel = (currentLevel) => {
      const availableLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      const currentIndex = availableLevels.indexOf(currentLevel);
      return currentIndex < availableLevels.length - 1 ? availableLevels[currentIndex + 1] : null;
    };
    
    const nextLevel = getNextLevel(level);
    
    return (
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold">Risultati - Livello {level}</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-3xl font-bold text-blue-600 mb-2">{percentage}%</p>
          <p className="text-lg">Hai risposto correttamente a {score} domande su {totalQuestions}</p>
          
          {perfect && (
            <div className="mt-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-500 rounded-lg">
              <p className="text-yellow-800 font-bold text-xl text-center">
                🎉 PUNTEGGIO PERFETTO! 🎉
              </p>
              <p className="text-yellow-700 text-center mt-1">
                Tutte le risposte corrette! Sei incredibile! ⭐
              </p>
            </div>
          )}
          
          {passed && nextLevel ? (
            <div className="mt-4 p-4 bg-green-100 border border-green-500 rounded-lg">
              <p className="text-green-700 font-semibold">🎉 Complimenti! Puoi passare al livello successivo!</p>
              <button onClick={handleLevelUp} className="mt-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                Vai al Livello {nextLevel}
              </button>
            </div>
          ) : !passed ? (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-500 rounded-lg">
              <p className="text-yellow-700">Hai bisogno dell'80% per passare al livello successivo. Continua ad allenarti!</p>
            </div>
          ) : !nextLevel ? (
            <div className="mt-4 p-4 bg-blue-100 border border-blue-500 rounded-lg">
              <p className="text-blue-700">🏆 Hai completato tutti i livelli! Sei un maestro degli accordi!</p>
            </div>
          ) : null}
        </div>
        
        <div className="space-y-2">
          <button onClick={startGame} className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
            Gioca Ancora
          </button>
          <button onClick={() => setScreen('menu')} className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
            Torna al Menu
          </button>
        </div>
      </div>
    );
  };

  // Schermata Teoria per visualizzare tutta la teoria musicale
  const TheoryScreen = () => {
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [showAllLevels, setShowAllLevels] = useState(false);
    
    // Funzione per organizzare gli accordi per tipo
    const organizeChordsByType = (chords) => {
      const types = {};
      chords.forEach(chord => {
        // Determina il tipo di accordo dall'explanation
        let type = 'Altri';
        if (chord.explanation.includes('Triade maggiore')) type = 'Triadi Maggiori';
        else if (chord.explanation.includes('Triade minore')) type = 'Triadi Minori';
        else if (chord.explanation.includes('Triade aumentata')) type = 'Triadi Aumentate';
        else if (chord.explanation.includes('Triade diminuita')) type = 'Triadi Diminuite';
        else if (chord.explanation.includes('sospesa')) type = 'Accordi Sospesi';
        else if (chord.explanation.includes('aggiunta')) type = 'Accordi con Note Aggiunte';
        else if (chord.explanation.includes('settima maggiore')) type = 'Accordi di 7ª Maggiore';
        else if (chord.explanation.includes('settima minore') || chord.explanation.includes('settima dominante')) type = 'Accordi di 7ª Dominante';
        else if (chord.explanation.includes('nona')) type = 'Accordi di 9ª';
        else if (chord.explanation.includes('inversione')) {
          if (chord.explanation.includes('prima inversione')) type = 'Prime Inversioni';
          else if (chord.explanation.includes('seconda inversione')) type = 'Seconde Inversioni';
          else if (chord.explanation.includes('terza inversione')) type = 'Terze Inversioni';
          else if (chord.explanation.includes('quarta inversione')) type = 'Quarte Inversioni';
        }
        
        if (!types[type]) types[type] = [];
        types[type].push(chord);
      });
      return types;
    };
    
    const availableLevels = Object.keys(chordDatabase).map(Number).sort((a, b) => a - b);
    
    return (
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">📚 Teoria Musicale Completa</h2>
          <button 
            onClick={() => setScreen('menu')} 
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p className="font-semibold text-blue-800">📖 Modalità Teoria</p>
          <p className="text-blue-700">Esplora tutta la teoria musicale organizzata per livelli e tipologie di accordi.</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Visualizza:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAllLevels(false)}
                className={`px-3 py-1 rounded text-sm transition-colors ${!showAllLevels ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Singolo Livello
              </button>
              <button
                onClick={() => setShowAllLevels(true)}
                className={`px-3 py-1 rounded text-sm transition-colors ${showAllLevels ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Tutti i Livelli
              </button>
            </div>
          </div>
          
          {!showAllLevels && (
            <div>
              <label className="block text-sm font-medium mb-2">Seleziona Livello:</label>
              <select 
                value={selectedLevel} 
                onChange={(e) => setSelectedLevel(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                {availableLevels.map(level => (
                  <option key={level} value={level}>
                    Livello {level}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {showAllLevels ? (
            // Mostra tutti i livelli
            availableLevels.map(level => {
              const levelData = chordDatabase[level];
              const organizedChords = organizeChordsByType(levelData.chords);
              
              return (
                <div key={level} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-blue-600">📚 Livello {level}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Totale accordi: {levelData.chords.length} | 
                    Domande per round: {levelData.questionsPerRound}
                  </p>
                  
                  {Object.entries(organizedChords).map(([type, chords]) => (
                    <div key={type} className="mb-4">
                      <h4 className="font-semibold text-md mb-2 text-green-700">{type} ({chords.length})</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {chords.map((chord, idx) => (
                          <div key={idx} className="bg-white p-3 rounded border-l-4 border-blue-400">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-mono font-bold text-blue-600">{chord.symbol}</span>
                                <span className="ml-2 text-gray-700">{chord.name}</span>
                              </div>
                              <span className="text-sm font-mono text-gray-500">{chord.notes}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{chord.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          ) : (
            // Mostra solo il livello selezionato
            (() => {
              const levelData = chordDatabase[selectedLevel];
              const organizedChords = organizeChordsByType(levelData.chords);
              
              return (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-blue-600">📚 Livello {selectedLevel}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Totale accordi: {levelData.chords.length} | 
                    Domande per round: {levelData.questionsPerRound}
                  </p>
                  
                  {Object.entries(organizedChords).map(([type, chords]) => (
                    <div key={type} className="mb-4">
                      <h4 className="font-semibold text-md mb-2 text-green-700">{type} ({chords.length})</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {chords.map((chord, idx) => (
                          <div key={idx} className="bg-white p-3 rounded border-l-4 border-blue-400">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-mono font-bold text-blue-600">{chord.symbol}</span>
                                <span className="ml-2 text-gray-700">{chord.name}</span>
                              </div>
                              <span className="text-sm font-mono text-gray-500">{chord.notes}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{chord.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()
          )}
        </div>
      </div>
    );
  };

  // Schermata Debug per visualizzare tutte le domande
  const DebugScreen = () => {
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [showAllLevels, setShowAllLevels] = useState(false);
    
    // Funzione per ottenere tutti gli accordi di un livello (senza filtri)
    const getAllChordsForLevel = (levelNum) => {
      return chordDatabase[levelNum]?.chords || [];
    };
    
    // Funzione per contare accordi per categoria di tasti
    const countByKeyType = (chords) => {
      const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const blackKeys = ['C#', 'Db', 'D#', 'Eb', 'F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb'];
      
      let white = 0, black = 0;
      
      chords.forEach(chord => {
        let rootNote = chord.symbol.replace(/[^A-G#b]/g, '');
        if (rootNote.includes('#')) {
          rootNote = rootNote.substring(0, 2);
        } else if (rootNote.includes('b')) {
          rootNote = rootNote.substring(0, 2);
        } else {
          rootNote = rootNote.charAt(0);
        }
        
        if (whiteKeys.includes(rootNote)) white++;
        else if (blackKeys.includes(rootNote)) black++;
      });
      
      return { white, black, total: white + black };
    };
    
    const availableLevels = Object.keys(chordDatabase).map(Number).sort((a, b) => a - b);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">🔍 Debug - Tutte le Domande</h2>
          <button 
            onClick={() => setScreen('menu')} 
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
          <p className="font-semibold text-yellow-800">🔧 Modalità Sviluppatore</p>
          <p className="text-yellow-700">Visualizza tutte le combinazioni di accordi per ogni livello, compresi tasti bianchi e neri.</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Visualizza:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAllLevels(false)}
                className={`px-3 py-1 rounded text-sm transition-colors ${!showAllLevels ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Singolo Livello
              </button>
              <button
                onClick={() => setShowAllLevels(true)}
                className={`px-3 py-1 rounded text-sm transition-colors ${showAllLevels ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Tutti i Livelli
              </button>
            </div>
          </div>
          
          {!showAllLevels && (
            <div>
              <label className="block text-sm font-medium mb-2">Seleziona Livello:</label>
              <select 
                value={selectedLevel} 
                onChange={(e) => setSelectedLevel(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                {availableLevels.map(level => (
                  <option key={level} value={level}>
                    Livello {level}: {getLevelDescription(level)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="bg-white border rounded-lg max-h-96 overflow-y-auto">
          {showAllLevels ? (
            // Mostra tutti i livelli
            availableLevels.map(level => {
              const chords = getAllChordsForLevel(level);
              const stats = countByKeyType(chords);
              
              return (
                <div key={level} className="border-b last:border-b-0">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="font-bold text-lg">
                      📚 Livello {level}: {getLevelDescription(level)}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      📊 Totale: {stats.total} accordi | 
                      ⚪ Tasti bianchi: {stats.white} | 
                      ⚫ Tasti neri: {stats.black} |
                      🎯 Domande per round: {chordDatabase[level]?.questionsPerRound || 'N/A'}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      {chords.map((chord, index) => (
                        <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-blue-600 font-bold w-12">{chord.symbol}</span>
                            <span className="font-medium">{chord.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-600">{chord.notes}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Mostra solo il livello selezionato
            (() => {
              const chords = getAllChordsForLevel(selectedLevel);
              const stats = countByKeyType(chords);
              
              return (
                <>
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="font-bold text-lg">
                      📚 Livello {selectedLevel}: {getLevelDescription(selectedLevel)}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      📊 Totale: {stats.total} accordi | 
                      ⚪ Tasti bianchi: {stats.white} | 
                      ⚫ Tasti neri: {stats.black} |
                      🎯 Domande per round: {chordDatabase[selectedLevel]?.questionsPerRound || 'N/A'}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      {chords.map((chord, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-4">
                            <span className="text-xs text-gray-400 w-6">{index + 1}.</span>
                            <span className="font-mono text-blue-600 font-bold text-base w-16">{chord.symbol}</span>
                            <span className="font-medium text-gray-800">{chord.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-600 font-medium">{chord.notes}</div>
                            <div className="text-xs text-gray-500 mt-1">{chord.explanation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()
          )}
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => setScreen('menu')} 
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Torna al Menu
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(to bottom, #0a0e27 0%, #151b3d 50%, #1e2951 100%)'
    }}>
      {/* Componente Coriandoli */}
      <Confetti show={showConfetti} />
      
      {/* Stelle animate */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
      </div>
      
      {/* Contenuto principale */}
      <div 
        className="relative z-10 p-4"
        onClick={(e) => {
          // Se clicco direttamente sul container di padding (area blu), torna al menu
          if (e.target === e.currentTarget && screen !== 'menu') {
            setScreen('menu');
          }
        }}
      >
        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-6">
            {screen === 'menu' && <MenuScreen />}
            {screen === 'settings' && <SettingsScreen />}
            {screen === 'learn' && <LearnScreen />}
            {screen === 'game' && <GameScreen />}
            {screen === 'results' && <ResultsScreen />}
            {screen === 'debug' && <DebugScreen />}
            {screen === 'theory' && <TheoryScreen />}
            {screen === 'glossary' && <GlossaryScreen />}
          </div>
          
          <div className="text-center mt-6 text-white/80 text-sm mb-16">
            <p className="mb-8">♫ MiLaSol - Gioco di accordi musicali 🎹</p>
            <div className="flex justify-center mt-8">
              <a
                href="https://www.sognandoilpiano.it"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center"
                style={{ textDecoration: 'none' }}
              >
                <div style={{ fontSize: '48px', fontFamily: 'Bodoni, \"Bodoni MT\", \"Didot\", \"Bodoni 72\", \"Bodoni Old Style\", serif' }}>
                  <span style={{ fontWeight: 'normal', color: 'white' }}>sognando</span>
                  <span style={{ fontStyle: 'italic', color: '#ff0000' }}>il</span>
                  <span style={{ fontWeight: 'bold', color: 'white' }}>piano</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChordMaster;