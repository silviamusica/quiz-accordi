import React, { useState } from 'react';

const ChordMasterApp = () => {
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
  const [lastChord, setLastChord] = useState(null);

  // Database accordi riorganizzato per livelli progressivi
  const chordDatabase = {
    1: { // Livello 1: Solo accordi maggiori nelle tonalità più comuni
      questionsPerRound: 5,
      chords: [
        { notes: 'Do Mi Sol', name: 'Do maggiore', symbol: 'C', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
        { notes: 'Re Fa# La', name: 'Re maggiore', symbol: 'D', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
        { notes: 'Mi Sol# Si', name: 'Mi maggiore', symbol: 'E', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
        { notes: 'Fa La Do', name: 'Fa maggiore', symbol: 'F', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
        { notes: 'Sol Si Re', name: 'Sol maggiore', symbol: 'G', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
        { notes: 'La Do# Mi', name: 'La maggiore', symbol: 'A', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
        { notes: 'Si Re# Fa#', name: 'Si maggiore', symbol: 'B', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' },
        { notes: 'Sib Re Fa', name: 'Si bemolle maggiore', symbol: 'Bb', explanation: 'Triade maggiore: fondamentale + terza maggiore + quinta giusta' }
      ]
    },
    2: { // Livello 2: Solo accordi minori (relativi minori delle tonalità comuni)
      questionsPerRound: 5,
      chords: [
        { notes: 'La Do Mi', name: 'La minore', symbol: 'Am', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta (relativo minore di Do maggiore)' },
        { notes: 'Si Re Fa#', name: 'Si minore', symbol: 'Bm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta (relativo minore di Re maggiore)' },
        { notes: 'Do# Mi Sol#', name: 'Do diesis minore', symbol: 'C#m', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta (relativo minore di Mi maggiore)' },
        { notes: 'Re Fa La', name: 'Re minore', symbol: 'Dm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta (relativo minore di Fa maggiore)' },
        { notes: 'Mi Sol Si', name: 'Mi minore', symbol: 'Em', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta (relativo minore di Sol maggiore)' },
        { notes: 'Fa# La Do#', name: 'Fa diesis minore', symbol: 'F#m', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta (relativo minore di La maggiore)' },
        { notes: 'Sol# Si Re#', name: 'Sol diesis minore', symbol: 'G#m', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta (relativo minore di Si maggiore)' },
        { notes: 'Sol Sib Re', name: 'Sol minore', symbol: 'Gm', explanation: 'Triade minore: fondamentale + terza minore + quinta giusta (relativo minore di Sib maggiore)' }
      ]
    },
    // Livello 3 rimosso
    4: { // Livello 4: Solo settime di dominante
      questionsPerRound: 6,
      chords: [
        { notes: 'Do Mi Sol Sib', name: 'Do settima', symbol: 'C7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Re Fa# La Do', name: 'Re settima', symbol: 'D7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Mi Sol# Si Re', name: 'Mi settima', symbol: 'E7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Fa La Do Mib', name: 'Fa settima', symbol: 'F7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Sol Si Re Fa', name: 'Sol settima', symbol: 'G7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'La Do# Mi Sol', name: 'La settima', symbol: 'A7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Si Re# Fa# La', name: 'Si settima', symbol: 'B7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' },
        { notes: 'Sib Re Fa Lab', name: 'Si bemolle settima', symbol: 'Bb7', explanation: 'Accordo di settima di dominante: triade maggiore + settima minore' }
      ]
    },
    // Livello 5 rimosso
    6: { // Livello 6: Solo settime maggiori
      questionsPerRound: 8,
      chords: [
        { notes: 'Do Mi Sol Si', name: 'Do settima maggiore', symbol: 'Cmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Re Fa# La Do#', name: 'Re settima maggiore', symbol: 'Dmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Mi Sol# Si Re#', name: 'Mi settima maggiore', symbol: 'Emaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Fa La Do Mi', name: 'Fa settima maggiore', symbol: 'Fmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Sol Si Re Fa#', name: 'Sol settima maggiore', symbol: 'Gmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'La Do# Mi Sol#', name: 'La settima maggiore', symbol: 'Amaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Si Re# Fa# La#', name: 'Si settima maggiore', symbol: 'Bmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' },
        { notes: 'Sib Re Fa La', name: 'Si bemolle settima maggiore', symbol: 'Bbmaj7', explanation: 'Settima maggiore: triade maggiore + settima maggiore' }
      ]
    },
    7: { // Livello 7: Solo settime minori
      questionsPerRound: 8,
      chords: [
        { notes: 'La Do Mi Sol', name: 'La minore settima', symbol: 'Am7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Si Re Fa# La', name: 'Si minore settima', symbol: 'Bm7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Do# Mi Sol# Si', name: 'Do diesis minore settima', symbol: 'C#m7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Re Fa La Do', name: 'Re minore settima', symbol: 'Dm7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Mi Sol Si Re', name: 'Mi minore settima', symbol: 'Em7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Fa# La Do# Mi', name: 'Fa diesis minore settima', symbol: 'F#m7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Sol# Si Re# Fa#', name: 'Sol diesis minore settima', symbol: 'G#m7', explanation: 'Settima minore: triade minore + settima minore' },
        { notes: 'Sol Sib Re Fa', name: 'Sol minore settima', symbol: 'Gm7', explanation: 'Settima minore: triade minore + settima minore' }
      ]
    },
    8: { // Livello 8: Ripasso di tutte le settime (dominante, maggiore, minore)
      questionsPerRound: 12,
      chords: [] // verrà riempito più sotto
    },
    9: { // Livello 9: Solo accordi di sesta
      questionsPerRound: 6,
      chords: [
        { notes: 'Do Mi Sol La', name: 'Do sesta', symbol: 'C6', explanation: 'Accordo di sesta: triade maggiore + sesta maggiore' },
        { notes: 'Re Fa# La Si', name: 'Re sesta', symbol: 'D6', explanation: 'Accordo di sesta: triade maggiore + sesta maggiore' },
        { notes: 'Mi Sol# Si Do#', name: 'Mi sesta', symbol: 'E6', explanation: 'Accordo di sesta: triade maggiore + sesta maggiore' },
        { notes: 'Fa La Do Re', name: 'Fa sesta', symbol: 'F6', explanation: 'Accordo di sesta: triade maggiore + sesta maggiore' },
        { notes: 'Sol Si Re Mi', name: 'Sol sesta', symbol: 'G6', explanation: 'Accordo di sesta: triade maggiore + sesta maggiore' },
        { notes: 'La Do# Mi Fa#', name: 'La sesta', symbol: 'A6', explanation: 'Accordo di sesta: triade maggiore + sesta maggiore' }
      ]
    },
    10: { // Livello 10: Solo accordi diminuiti
      questionsPerRound: 6,
      chords: [
        { notes: 'Do Mib Solb', name: 'Do diminuito', symbol: 'C°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Re Fa Lab', name: 'Re diminuito', symbol: 'D°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Mi Sol Sib', name: 'Mi diminuito', symbol: 'E°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Fa# La Do', name: 'Fa diesis diminuito', symbol: 'F#°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Sol# Si Re', name: 'Sol diesis diminuito', symbol: 'G#°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' },
        { notes: 'Si Re Fa', name: 'Si diminuito', symbol: 'B°', explanation: 'Triade diminuita: fondamentale + terza minore + quinta diminuita' }
      ]
    },
    11: { // Livello 11: Solo accordi aumentati
      questionsPerRound: 6,
      chords: [
        { notes: 'Do Mi Sol#', name: 'Do aumentato', symbol: 'C+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Re Fa# La#', name: 'Re aumentato', symbol: 'D+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Mi Sol# Si#', name: 'Mi aumentato', symbol: 'E+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Fa La Do#', name: 'Fa aumentato', symbol: 'F+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'Sol Si Re#', name: 'Sol aumentato', symbol: 'G+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' },
        { notes: 'La Do# Mi#', name: 'La aumentato', symbol: 'A+', explanation: 'Triade aumentata: fondamentale + terza maggiore + quinta aumentata' }
      ]
    },
    // Livello 12 rimosso
    13: { // Livello 13: Solo inversioni (slash chords)
      questionsPerRound: 10,
      chords: [
        { notes: 'Mi Sol Do', name: 'Do maggiore prima inversione', symbol: 'C/E', explanation: 'Prima inversione: la terza al basso' },
        { notes: 'Sol Do Mi', name: 'Do maggiore seconda inversione', symbol: 'C/G', explanation: 'Seconda inversione: la quinta al basso' },
        { notes: 'Fa# La Re', name: 'Re maggiore prima inversione', symbol: 'D/F#', explanation: 'Prima inversione: la terza al basso' },
        { notes: 'La Re Fa#', name: 'Re maggiore seconda inversione', symbol: 'D/A', explanation: 'Seconda inversione: la quinta al basso' },
        { notes: 'Do Mi La', name: 'La minore prima inversione', symbol: 'Am/C', explanation: 'Prima inversione: la terza al basso' },
        { notes: 'Mi La Do', name: 'La minore seconda inversione', symbol: 'Am/E', explanation: 'Seconda inversione: la quinta al basso' },
        { notes: 'Si Re Sol', name: 'Sol maggiore prima inversione', symbol: 'G/B', explanation: 'Prima inversione: la terza al basso' },
        { notes: 'Re Sol Si', name: 'Sol maggiore seconda inversione', symbol: 'G/D', explanation: 'Seconda inversione: la quinta al basso' }
      ]
    },
    14: { // Livello 14: Solo accordi di nona
      questionsPerRound: 8,
      chords: [
        { notes: 'Do Mi Sol Sib Re', name: 'Do nona', symbol: 'C9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Re Fa# La Do Mi', name: 'Re nona', symbol: 'D9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Mi Sol# Si Re Fa#', name: 'Mi nona', symbol: 'E9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Fa La Do Mib Sol', name: 'Fa nona', symbol: 'F9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'Sol Si Re Fa La', name: 'Sol nona', symbol: 'G9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' },
        { notes: 'La Do# Mi Sol Si', name: 'La nona', symbol: 'A9', explanation: 'Accordo di nona: settima di dominante + nona maggiore' }
      ]
    },
    15: { // Livello 15: tutti gli accordi disponibili
      questionsPerRound: 12, // numero medio di domande
      chords: [] // verrà riempito subito dopo la definizione di chordDatabase
    },
  };

  // Popola il livello 15 con l’unione di tutti gli accordi precedenti
  chordDatabase[15].chords = Array.from(
    new Set(
      Object.values(chordDatabase)
        .filter(lvl => lvl.chords) // sicurezza
        .flatMap(lvl => lvl.chords)
    )
  );

  // Popola il livello 8 con tutte le settime (dominante, maggiori, minori)
  chordDatabase[8].chords = Array.from(
    new Set([
      ...chordDatabase[4].chords,  // 7 di dominante
      ...chordDatabase[6].chords,  // maj7
      ...chordDatabase[7].chords   // m7
    ])
  );

  // Ordine progressivo dei livelli reali
  const orderedLevels = Object.keys(chordDatabase).map(Number).sort((a, b) => a - b);
  const getDisplayLevel = (lvl) => orderedLevels.indexOf(lvl) + 1;

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
          
          <h3 className="text-xl font-bold mb-2">Differenza con maj7</h3>
          <p>Mentre maj7 aggiunge la settima maggiore, l'accordo di sesta aggiunge la sesta maggiore, creando un suono più aperto e meno dissonante.</p>
        </div>
      )
    },
    'inversions': {
      title: 'Inversioni (Slash Chords)',
      content: (
        <div>
          <h3 className="text-xl font-bold mb-2">Cosa sono le Inversioni?</h3>
          <p className="mb-4">Un'inversione è quando una nota diversa dalla fondamentale si trova al basso.</p>
          
          <h3 className="text-xl font-bold mb-2">Prima Inversione</h3>
          <p className="mb-2">La terza dell'accordo è al basso:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>C/E = Mi + Sol + Do (invece di Do + Mi + Sol)</li>
            <li>La terza (Mi) è la nota più bassa</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Seconda Inversione</h3>
          <p className="mb-2">La quinta dell'accordo è al basso:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>C/G = Sol + Do + Mi</li>
            <li>La quinta (Sol) è la nota più bassa</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-2">Utilizzo</h3>
          <p>Le inversioni creano linee di basso più fluide e movimenti armonici più interessanti.</p>
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
          
          <h3 className="text-xl font-bold mb-2">Utilizzo</h3>
          <p className="mb-4">Gli accordi di nona aggiungono colore e complessità armonica. Sono molto usati nel jazz, funk e R&B per creare sonorità più ricche.</p>
          
          <h3 className="text-xl font-bold mb-2">Varianti</h3>
          <p>Esistono anche maj9 (con settima maggiore), m9 (minore con nona), e altre varianti che combinano diversi tipi di settime con la nona.</p>
        </div>
      )
    }
  };

  // Funzioni helper
  const getRandomChord = () => {
    const levelChords = chordDatabase[level].chords;
    if (levelChords.length <= 1) return levelChords[0];

    let newChord;
    do {
      newChord = levelChords[Math.floor(Math.random() * levelChords.length)];
    } while (lastChord && newChord.symbol === lastChord.symbol && levelChords.length > 1);

    setLastChord(newChord);
    return newChord;
  };

  const checkAnswer = (answer, correctName, correctSymbol) => {
    const normalize = str => str.toLowerCase().replace(/[^a-z]/g, '');
    const normalizeSymbol = str => str.toLowerCase().replace(/[^a-z0-9+°øm#/]/g, '');
    
    return normalize(answer) === normalize(correctName) || 
           normalizeSymbol(answer) === normalizeSymbol(correctSymbol);
  };

  const getQuestionsPerRound = () => {
    return chordDatabase[level].questionsPerRound || 10;
  };

  const startGame = () => {
    setScreen('game');
    setScore(0);
    setTotalQuestions(0);
    setQuestionsCount(0);
    setGameActive(true);
    setCurrentChord(getRandomChord());
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
        setCurrentChord(getRandomChord());
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
        return [...chordDatabase[4].chords, ...chordDatabase[6].chords, ...chordDatabase[7].chords];
      case 'augmented-diminished': 
        return [...chordDatabase[10].chords, ...chordDatabase[11].chords];
      case 'sixths':
        return chordDatabase[9].chords;
      case 'inversions':
        return chordDatabase[13].chords;
      case 'ninths':
        return chordDatabase[14].chords;
      default: 
        return chordDatabase[1].chords;
    }
  };

  // Componenti render
  const MenuScreen = () => (
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">ChordMaster</h1>
      <div className="space-y-4">
        <button onClick={() => setScreen('learn')} className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">
          📚 Impara
        </button>
        <button onClick={startGame} className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
          🎮 Gioca
        </button>
        <button onClick={() => setScreen('settings')} className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors">
          ⚙️ Impostazioni
        </button>
      </div>
    </div>
  );

  const SettingsScreen = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Impostazioni</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-lg font-medium mb-2">Livello di difficoltà:</label>
          <select
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full p-2 border rounded-lg"
          >
            {orderedLevels.map((lvlKey) => (
              <option key={lvlKey} value={lvlKey}>
                {`Livello ${getDisplayLevel(lvlKey)} - ${(() => {
                  switch (lvlKey) {
                    case 1: return 'Solo accordi maggiori (5 domande)';
                    case 2: return 'Solo accordi minori (5 domande)';
                    case 4: return 'Solo settime di dominante (6 domande)';
                    case 6: return 'Solo settime maggiori (8 domande)';
                    case 7: return 'Solo settime minori (8 domande)';
                    case 8: return 'Ripasso settime (7, maj7, m7) (12 domande)';
                    case 9: return 'Solo accordi di sesta (6 domande)';
                    case 10: return 'Solo accordi diminuiti (6 domande)';
                    case 11: return 'Solo accordi aumentati (6 domande)';
                    case 13: return 'Solo inversioni (10 domande)';
                    case 14: return 'Solo accordi di nona (8 domande)';
                    case 15: return 'Mega mix: tutti gli accordi (12 domande)';
                    default: return '';
                  }
                })()}`}
              </option>
            ))}
          </select>
        </div>
        <button onClick={() => setScreen('menu')} className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
          Torna al Menu
        </button>
      </div>
    </div>
  );

  const LearnScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showTheory, setShowTheory] = useState(true);
    const chords = getLearnChords();
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
              {chord && (
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-blue-600 mb-2">{chord.notes}</h3>
                    <p className="text-xl font-semibold">{chord.name}</p>
                    <p className="text-lg text-gray-600">Sigla: {chord.symbol}</p>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{chord.explanation}</p>
                </div>
              )}
              
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
          <h2 className="text-2xl font-bold">Modalità Gioco - Livello {getDisplayLevel(level)}</h2>
          <p className="text-gray-600">Domanda {questionsCount + 1} / {getQuestionsPerRound()}</p>
          <p className="text-sm text-gray-500">Punteggio: {score} / {totalQuestions}</p>
        </div>

        {/* Legenda sigle accordi */}
        <div className="bg-blue-50 p-4 rounded-lg text-sm">
          <p className="text-blue-700 mb-2">
            Puoi rispondere con il nome completo (es. Do maggiore) o la sigla (C)
          </p>
          <h4 className="font-semibold text-blue-800 mb-2">Sigle degli accordi:</h4>
          <div className="grid grid-cols-2 gap-1 text-blue-700">
            <span><strong>C</strong>: accordo maggiore</span>
            <span><strong>Cm</strong>: accordo minore</span>
            <span><strong>C+</strong>: accordo aumentato</span>
            <span><strong>C°</strong>: accordo diminuito</span>
            <span><strong>C7</strong>: settima dominante</span>
            <span><strong>Cmaj7</strong>: settima maggiore</span>
            <span><strong>Cm7</strong>: settima minore</span>
            <span><strong>C6</strong>: accordo di sesta</span>
            <span><strong>C9</strong>: accordo di nona</span>
            <span><strong>C/E</strong>: inversione (E al basso)</span>
          </div>
        </div>
        
        {currentChord && (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-blue-600 mb-4">{currentChord.notes}</h3>
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

    // calcola il prossimo livello realmente esistente
    const nextLevel = orderedLevels.find(lvl => lvl > level);

    return (
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold">Risultati - Livello {getDisplayLevel(level)}</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-3xl font-bold text-blue-600 mb-2">{percentage}%</p>
          <p className="text-lg">Hai risposto correttamente a {score} domande su {totalQuestions}</p>

          {passed && nextLevel ? (
            <div className="mt-4 p-4 bg-green-100 border border-green-500 rounded-lg">
              <p className="text-green-700 font-semibold">🎉 Complimenti! Puoi passare al livello successivo!</p>
              <button
                onClick={() => {
                  setLevel(nextLevel);
                  setTimeout(() => {
                    startGame();
                  }, 0);
                }}
                className="mt-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                Vai al Livello {getDisplayLevel(nextLevel)}
              </button>
            </div>
          ) : !passed ? (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-500 rounded-lg">
              <p className="text-yellow-700">Hai bisogno dell'80% per passare al livello successivo. Continua ad allenarti!</p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-blue-100 border border-blue-500 rounded-lg">
              <p className="text-blue-700">🏆 Hai completato tutti i livelli! Sei un maestro degli accordi!</p>
            </div>
          )}
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

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0a0e27, #151b3d 50%, #1e2951 100%)'
      }}
    >
      {/* Stellar background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-[url('/starfield.png')] bg-cover animation-pulse opacity-50"></div>
      </div>
      <div className="relative z-10 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-6">
            {screen === 'menu' && <MenuScreen />}
            {screen === 'settings' && <SettingsScreen />}
            {screen === 'learn' && <LearnScreen />}
            {screen === 'game' && <GameScreen />}
            {screen === 'results' && <ResultsScreen />}
          </div>
        </div>
      </div> {/* end relative z-10 */}
      <div className="text-center mt-6 text-white/80 text-sm relative z-10 p-4">
        © 2025 · ChordMaster by Silvia Platania 2025 – Tutti i diritti riservati
      </div>
    </div>
  );
};

export default ChordMasterApp;