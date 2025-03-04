const gridTic = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const gridPfour = [
  ["", "", "", "", "", "",""],
  ["", "", "", "", "", "",""],
  ["", "", "", "", "", "",""],
  ["", "", "", "", "", "",""],
  ["", "", "", "", "", "",""],
  ["", "", "", "", "", "",""],
  
]
const gameContainer = document.querySelector("#gameContainer");
const croix = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="10" x2="90" y2="90" stroke="#00ffcc" stroke-width="10" stroke-linecap="round"/>
            <line x1="90" y1="10" x2="10" y2="90" stroke="#00ffcc" stroke-width="10" stroke-linecap="round"/>
        </svg>`;
const rond = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="#00ffcc" stroke-width="10" fill="none"/>
        </svg>`;
let verrouillageClic = false;
let modeP4 = ""

function createMap(map, game) {
  // Nettoyage du conteneur pour éviter plusieurs grilles
  gameContainer.innerHTML = "";
  map.forEach((row, i) => {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("row");
    gameContainer.appendChild(rowContainer);

    row.forEach((cell, j) => {
      const cellContainer = document.createElement("div");
      cellContainer.classList.add("cell");
      cellContainer.textContent = cell;
      rowContainer.appendChild(cellContainer);
      if (game) {
        cellContainer.addEventListener("click", () => {
          game(i, j, cellContainer);
        });
      }
    });
  });
}
let testc = 0;
let testr = 0;
function verif() {
  // Check rows, columns and diagonals
  for (let i = 0; i < 3; i++) {
    // Check rows
    if (
      gridTic[i][0] !== "" &&
      gridTic[i][0] === gridTic[i][1] &&
      gridTic[i][1] === gridTic[i][2]
    ) {
      console.log(`Player ${gridTic[i][0]} wins!`);
      return true;
    }

    // Check columns
    if (
      gridTic[0][i] !== "" &&
      gridTic[0][i] === gridTic[1][i] &&
      gridTic[1][i] === gridTic[2][i]
    ) {
      console.log(`Player ${gridTic[0][i]} wins!`);
      return true;
    }
  }

  // Check diagonals
  if (
    gridTic[0][0] !== "" &&
    gridTic[0][0] === gridTic[1][1] &&
    gridTic[1][1] === gridTic[2][2]
  ) {
    console.log(`Player ${gridTic[0][0]} wins!`);
    return true;
  }
  if (
    gridTic[0][2] !== "" &&
    gridTic[0][2] === gridTic[1][1] &&
    gridTic[1][1] === gridTic[2][0]
  ) {
    console.log(`Player ${gridTic[0][2]} wins!`);
    return true;
  }

  return false; // No win
}

function playMJJ(i, j, cell) {
  if (gridTic[i][j] === "") {
    count++;
    if (currentPlayer === 1) {
      gridTic[i][j] = "1";
      cell.innerHTML = croix; // Utilisez innerHTML pour mettre à jour le contenu
      currentPlayer = 2;
    } else {
      gridTic[i][j] = "2";
      cell.innerHTML = rond; // Utilisez innerHTML pour mettre à jour le contenu
      currentPlayer = 1;
    }

    // Vérifiez si quelqu'un a gagné après chaque coup
    if (verif()) {
      displayEndGameModal(`${currentPlayer}`);
      // Optionally reset the game or handle the win state
      return;
    }

    // Vérifiez si toutes les cases sont remplies
    if (count === 9) {
      displayEndGameModal('null');
    }
  }
}
function getCellElement(i, j) {
  const rows = document.querySelectorAll('.row');
  if (rows[i] && rows[i].children[j]) {
    return rows[i].children[j];
  }
  throw new Error(`Cellule [${i},${j}] introuvable`);
}

const scores = {
  '1': -100,  // Joueur humain
  '2': 100,   // IA
  'nul': 0
};
let score = {
  joueur: 0,
  ia: 0,
  highscoreJoueur: localStorage.getItem('highscoreJoueur') || 0,
  highscoreIA: localStorage.getItem('highscoreIA') || 0
};

function meilleurCoup() {
  let meilleurScore = -Infinity;
  let coup = null;
  const coupsValides = [];

  // Première passe : collecter tous les coups valides
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (gridTic[i][j] === "") {
        coupsValides.push({i, j});
      }
    }
  }

  // Si aucun coup possible (normalement impossible)
  if (coupsValides.length === 0) {
    throw new Error("Aucun coup disponible");
  }

  // Deuxième passe : évaluer les coups
  coupsValides.forEach(({i, j}) => {
    gridTic[i][j] = "2";
    const score = minimax(gridTic, 0, false, -Infinity, Infinity);
    gridTic[i][j] = "";

    if (score > meilleurScore) {
      meilleurScore = score;
      coup = {i, j};
    }
  });

  return coup || coupsValides[0]; // Fallback garantissant un coup
}

function minimax(grille, profondeur, estMaximisation, alpha, beta) {
  const resultat = verifIA(grille);
  if (resultat !== null) {
    return scores[resultat] + (estMaximisation ? -profondeur : profondeur);
  }

  if (estMaximisation) {
    let meilleurScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grille[i][j] === "") {
          grille[i][j] = "2";
          const score = minimax(grille, profondeur + 1, false, alpha, beta);
          grille[i][j] = "";
          meilleurScore = Math.max(score, meilleurScore);
          alpha = Math.max(alpha, score);
          if (beta <= alpha) break;
        }
      }
    }
    return meilleurScore;
  } else {
    let pireScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grille[i][j] === "") {
          grille[i][j] = "1";
          const score = minimax(grille, profondeur + 1, true, alpha, beta);
          grille[i][j] = "";
          pireScore = Math.min(score, pireScore);
          beta = Math.min(beta, score);
          if (beta <= alpha) break;
        }
      }
    }
    return pireScore;
  }
}

function verifIA(grille) {
  // Vérification des lignes
  for (let i = 0; i < 3; i++) {
    if (grille[i][0] === grille[i][1] && grille[i][1] === grille[i][2]) {
      if (grille[i][0] !== "") return grille[i][0];
    }
  }

  // Vérification des colonnes
  for (let j = 0; j < 3; j++) {
    if (grille[0][j] === grille[1][j] && grille[1][j] === grille[2][j]) {
      if (grille[0][j] !== "") return grille[0][j];
    }
  }

  // Diagonales
  if (grille[0][0] === grille[1][1] && grille[1][1] === grille[2][2]) {
    if (grille[0][0] !== "") return grille[0][0];
  }

  if (grille[0][2] === grille[1][1] && grille[1][1] === grille[2][0]) {
    if (grille[0][2] !== "") return grille[0][2];
  }

  // Match nul
  let casesVides = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grille[i][j] === "") casesVides++;
    }
  }
  return casesVides === 0 ? "nul" : null;
}

function iaOptimisee() {
  const coup = meilleurCoup();
  
  if (!coup || gridTic[coup.i][coup.j] !== "") {
    // Logique de secours
    const coupsDisponibles = [];
    gridTic.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === "") coupsDisponibles.push({i, j});
      });
    });
    coup = coupsDisponibles[Math.floor(Math.random() * coupsDisponibles.length)];
  }

  gridTic[coup.i][coup.j] = "2";
  const cell = getCellElement(coup.i, coup.j);
  cell.innerHTML = rond;
  count++;
}

// Modification de playMJO
function playMJO(i, j, cell) {
  if (verrouillageClic || gridTic[i][j] !== '') return;

  verrouillageClic = true;
  gridTic[i][j] = "1";
  cell.innerHTML = croix;
  count++;

  if (verif()) {
    displayEndGameModal('you');
    reinitialiserJeu();
    return;
  }

  if (count < 9) {
    setTimeout(() => {
      iaOptimisee();
      verrouillageClic = false;
    }, 500);
  } else {
    displayEndGameModal('null');
    reinitialiserJeu();
  }
}

function reinitialiserJeu() {
  gridTic.forEach((row, i) => {
      row.forEach((_, j) => {
          gridTic[i][j] = '';
          const cell = getCellElement(i, j);
          cell.innerHTML = '';
      });
  });
  count = 0;
  verrouillageClic = false;
  document.getElementById('gameModal').style.display = 'none';
  document.getElementById('Games').style.display = 'block';
  document.getElementById('gamecontainer').style.display = 'block';
}
function jouerCoupIA() {
  let i, j;
  do {
    i = Math.floor(Math.random() * 3);
    j = Math.floor(Math.random() * 3);
  } while (gridTic[i][j] !== '');

  gridTic[i][j] = '2';
  const cell = getCellElement(i, j);
  cell.innerHTML = rond;
  count++;

  if (verif()) {
    alert("L'ordinateur a gagné !");
    reinitialiserJeu();
  } else if (count >= 9) {
    alert("Match nul !");
    reinitialiserJeu();
  }
}
function randomize(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
let currentPlayer = 1; // 1 pour cross, 2 pour round
let count = 0;
function startGameM(t) {
  t = t.textContent;
  console.log(t);
  let plateau = document.querySelector("#Games");
  plateau.style.display = "flex";
  let menu = document.querySelector("#Startmenu");
  if (menu) {
    menu.style.display = "none";
  } else {
    console.error("Element with ID 'Games' not found.");
  }
  if (t === "Joueur VS Joueur") {
    createMap(gridTic, playMJJ);
  } else {
    createMap(gridTic, playMJO);
  }
}
function startGameP(t) {
  t = t.textContent;
  console.log(t);
  let plateau = document.querySelector("#Games");
  plateau.style.display = "block";
  let menu = document.querySelector("#Startmenu");
  if (menu) {
    menu.style.display = "none";
    createMap(gridPfour);
  } else {
    console.error("Element with ID 'Games' not found.");
  }
  if (t === "Puissance 4 avec ami") {
    playPJJ();
  } else {
    playPJO();
  }
}
function displayEndGameModal(result) {
  const modal = document.getElementById('gameModal');
  const title = document.getElementById('modalTitle');
  
  // Mise à jour des scores
  if (result === 'joueur') score.joueur++;
  if (result === 'ia') score.ia++;
  
  // Mise à jour des high scores
  if (score.joueur > score.highscoreJoueur) {
      score.highscoreJoueur = score.joueur;
      localStorage.setItem('highscoreJoueur', score.joueur);
  }
  if (score.ia > score.highscoreIA) {
      score.highscoreIA = score.ia;
      localStorage.setItem('highscoreIA', score.ia);
  }
  
  // Mise à jour de l'interface
  title.textContent = result === 'nul' ? 'Match Nul !' : `${result === 'joueur' ? 'Victoire du Joueur !' : 'L\'IA a Gagné !'}`;
  document.getElementById('currentPlayerScore').textContent = score.joueur;
  document.getElementById('currentIAScore').textContent = score.ia;
  document.getElementById('highscorePlayer').textContent = score.highscoreJoueur;
  document.getElementById('highscoreIA').textContent = score.highscoreIA;
  
  // Affichage
  modal.style.display = 'flex';
  document.getElementById('Games').style.display = 'none';
}

function showMainMenu() {
  document.getElementById('gameModal').style.display = 'none';
  document.getElementById('Startmenu').style.display = 'block';
  document.getElementById('gameContainer').style.display = 'none';
  reinitialiserJeu();
}





// --- Fonctions pour le Puissance 4 ---

// Gère le clic sur une cellule pour le Puissance 4
function handleClickP4(i, j, cell) {
  // Seul le numéro de colonne (j) est pertinent
  // En mode PvAI, seul le joueur 1 (humain) doit jouer
  if (currentPlayer === 1 || modeP4 === "pvp") {
    dropTokenP4(j);
    // En mode joueur/ordinateur, après le coup du joueur, lance le coup de l'IA si la partie n'est pas terminée
    if (modeP4 === "pvai" && currentPlayer === 2 && !checkWinP4()) {
      setTimeout(() => {
        iaMoveP4();
      }, 500);
    }
  }
}

// "Lâche" le jeton dans la colonne choisie
function dropTokenP4(column) {
  for (let i = gridPfour.length - 1; i >= 0; i--) {
    if (gridPfour[i][column] === "") {
      gridPfour[i][column] = currentPlayer.toString(); // On stocke "1" ou "2"
      let cellElem = getCellElement(i, column);
      if (currentPlayer === 1) {
        cellElem.innerHTML = croix;
      } else {
        cellElem.innerHTML = rond;
      }
      count++;
      if (checkWinP4()) {
        // On affiche le modal de fin en indiquant le gagnant
        displayEndGameModal(currentPlayer === 1 ? 'joueur' : 'ia');
        // Ici, vous pouvez décider de bloquer les clics ou de relancer la partie
      } else if (count === gridPfour.length * gridPfour[0].length) {
        displayEndGameModal('nul');
      } else {
        currentPlayer = (currentPlayer === 1) ? 2 : 1;
      }
      return;
    }
  }
  alert("Colonne pleine !");
}

// Vérifie si 4 jetons sont alignés dans le gridPfour
function checkWinP4() {
  const rows = gridPfour.length;
  const cols = gridPfour[0].length;
  // Vérification horizontale
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j <= cols - 4; j++) {
      let token = gridPfour[i][j];
      if (token !== "" &&
          token === gridPfour[i][j+1] &&
          token === gridPfour[i][j+2] &&
          token === gridPfour[i][j+3]) {
        return true;
      }
    }
  }
  // Vérification verticale
  for (let i = 0; i <= rows - 4; i++) {
    for (let j = 0; j < cols; j++) {
      let token = gridPfour[i][j];
      if (token !== "" &&
          token === gridPfour[i+1][j] &&
          token === gridPfour[i+2][j] &&
          token === gridPfour[i+3][j]) {
        return true;
      }
    }
  }
  // Vérification diagonale (bas-droite)
  for (let i = 0; i <= rows - 4; i++) {
    for (let j = 0; j <= cols - 4; j++) {
      let token = gridPfour[i][j];
      if (token !== "" &&
          token === gridPfour[i+1][j+1] &&
          token === gridPfour[i+2][j+2] &&
          token === gridPfour[i+3][j+3]) {
        return true;
      }
    }
  }
  // Vérification diagonale (bas-gauche)
  for (let i = 0; i <= rows - 4; i++) {
    for (let j = 3; j < cols; j++) {
      let token = gridPfour[i][j];
      if (token !== "" &&
          token === gridPfour[i+1][j-1] &&
          token === gridPfour[i+2][j-2] &&
          token === gridPfour[i+3][j-3]) {
        return true;
      }
    }
  }
  return false;
}

// Coup de l'IA pour le Puissance 4 en mode joueur/ordinateur
function iaMoveP4() {
  // On récupère toutes les colonnes non pleines (la case la plus haute vide)
  const cols = gridPfour[0].length;
  let availableColumns = [];
  for (let j = 0; j < cols; j++) {
    if (gridPfour[0][j] === "") {
      availableColumns.push(j);
    }
  }
  if (availableColumns.length === 0) return; // Plateau plein
  const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
  dropTokenP4(randomCol);
}

// --- Fonction utilitaire pour récupérer la cellule (pour les deux grilles) ---
function getCellElement(i, j) {
  const rows = document.querySelectorAll('.row');
  if (rows[i] && rows[i].children[j]) {
    return rows[i].children[j];
  }
  throw new Error(`Cellule [${i},${j}] introuvable`);
}

// --- Fonctions de démarrage des jeux ---
function startGameM(t) {
  currentPlayer = 1;
  count = 0;
  // Pour Tic Tac Toe, on passe directement le callback de gestion de clic
  t = t.textContent;
  console.log(t);
  let plateau = document.querySelector("#Games");
  plateau.style.display = "flex";
  let menu = document.querySelector("#Startmenu");
  if (menu) {
    menu.style.display = "none";
  } else {
    console.error("Element with ID 'Games' not found.");
  }
  if (t === "Joueur VS Joueur") {
    createMap(gridTic, playMJJ);
  } else {
    createMap(gridTic, playMJO);
  }
}

function startGameP(t) {
  currentPlayer = 1;
  count = 0;
  t = t.textContent;
  console.log(t);
  let plateau = document.querySelector("#Games");
  plateau.style.display = "block";
  let menu = document.querySelector("#Startmenu");
  if (menu) {
    menu.style.display = "none";
    createMap(gridPfour, handleClickP4);
  } else {
    console.error("Element with ID 'Games' not found.");
  }
  // Définir le mode Puissance 4 selon le texte cliqué
  if (t === "Puissance 4 avec ami") {
    modeP4 = "pvp";
  } else {
    modeP4 = "pvai";
  }
}

// --- Réinitialisation du jeu (pour les deux grilles) ---
function reinitialiserJeu() {
  // Réinitialise la grille Tic Tac Toe
  gridTic.forEach((row, i) => {
    row.forEach((_, j) => {
      gridTic[i][j] = '';
      try {
        const cell = getCellElement(i, j);
        cell.innerHTML = '';
      } catch (e) {}
    });
  });
  // Réinitialise la grille Puissance 4
  gridPfour.forEach((row, i) => {
    row.forEach((_, j) => {
      gridPfour[i][j] = '';
      try {
        const cell = getCellElement(i, j);
        cell.innerHTML = '';
      } catch (e) {}
    });
  });
  count = 0;
  verrouillageClic = false;
  document.getElementById('gameModal').style.display = 'none';
  document.getElementById('Games').style.display = 'block';
  document.getElementById('gameContainer').style.display = 'block';
}

// --- Affichage du modal de fin de partie (inchangé) ---
function displayEndGameModal(result) {
  const modal = document.getElementById('gameModal');
  const title = document.getElementById('modalTitle');
  
  // Mise à jour des scores
  if (result === 'joueur') score.joueur++;
  if (result === 'ia') score.ia++;
  
  // Mise à jour des high scores
  if (score.joueur > score.highscoreJoueur) {
      score.highscoreJoueur = score.joueur;
      localStorage.setItem('highscoreJoueur', score.joueur);
  }
  if (score.ia > score.highscoreIA) {
      score.highscoreIA = score.ia;
      localStorage.setItem('highscoreIA', score.ia);
  }
  
  // Mise à jour de l'interface
  title.textContent = result === 'nul' ? 'Match Nul !' : `${result === 'joueur' ? 'Victoire du Joueur !' : 'L\'IA a Gagné !'}`;
  document.getElementById('currentPlayerScore').textContent = score.joueur;
  document.getElementById('currentIAScore').textContent = score.ia;
  document.getElementById('highscorePlayer').textContent = score.highscoreJoueur;
  document.getElementById('highscoreIA').textContent = score.highscoreIA;
  
  // Affichage
  modal.style.display = 'flex';
  document.getElementById('Games').style.display = 'none';
}

// Affiche le menu principal et réinitialise le jeu
function showMainMenu() {
  document.getElementById('gameModal').style.display = 'none';
  document.getElementById('Startmenu').style.display = 'block';
  document.getElementById('gameContainer').style.display = 'none';
  reinitialiserJeu();
}