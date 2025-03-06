class WordleGame {
    constructor() {
        this.ROWS = 6;
        this.LETTERS = 5;
        this.currentRow = 0;
        this.currentGuess = [];
        this.targetWord = '';
        this.gameOver = false;
        this.language = 'fr';

        // Liez this.handleInput à l'instance de la classe
        this.handleInput = this.handleInput.bind(this);

        this.init();
    }

    async init() {
        this.board = document.querySelector('.board');
        this.message = document.querySelector('.message');
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.startGame(e.target.dataset.lang));
        });
        document.querySelector('.restart-btn').addEventListener('click', () => this.startGame(this.language));

        // Ajoutez l'écouteur d'événement pour les touches du clavier
        document.addEventListener('keydown', this.handleInput);
    }

    async startGame(lang) {
        this.language = lang;
        this.targetWord = await this.fetchWord(lang);
        console.log('Mot à trouver:', this.targetWord); // Pour débogage
        this.currentRow = 0;
        this.currentGuess = []; // Réinitialiser le tableau des lettres actuelles
        this.gameOver = false;

        // Réinitialiser la grille
        this.board.innerHTML = '';
        for (let i = 0; i < this.ROWS; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            for (let j = 0; j < this.LETTERS; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                row.appendChild(cell);
            }
            this.board.appendChild(row);
        }

        // Réinitialiser les messages et le bouton
        this.message.textContent = '';
        document.querySelector('.restart-btn').style.display = 'none';
    }

    async fetchWord(lang) {
        if (lang === 'en') {
            const response = await fetch(`https://random-word-api.herokuapp.com/word?length=5`);
            const [word] = await response.json();
            return word.toUpperCase();
        } else {
            // Charger depuis un fichier JSON externe
            const response = await fetch('frenchWords.json');
            const words = await response.json();
            return words[Math.floor(Math.random() * words.length)].toUpperCase();
        }
    }

    handleInput(e) {
        if (this.gameOver) return;

        if (e.key === 'Enter') {
            e.preventDefault();

            if (this.currentGuess.length === this.LETTERS) {
                this.checkGuess();
            }
        } else if (e.key === 'Backspace') {
            if (this.currentGuess.length > 0) {
                this.currentGuess.pop();
                this.updateBoard();
            }
        } else if (/^[A-Za-z]$/.test(e.key)) {
            if (this.currentGuess.length < this.LETTERS) {
                this.currentGuess.push(e.key.toUpperCase());
                this.updateBoard();
            }
        }
    }

    updateBoard() {
        const cells = this.board.children[this.currentRow].children;
        for (let i = 0; i < this.LETTERS; i++) {
            cells[i].textContent = this.currentGuess[i] || '';
        }
    }

    checkGuess() {
        const guess = this.currentGuess.join('');
        const target = this.targetWord;
        const result = [];

        // Créer une copie des lettres restantes
        let remainingLetters = target.split('');

        // Vérifier les lettres correctes en premier
        for (let i = 0; i < this.LETTERS; i++) {
            if (guess[i] === target[i]) {
                result[i] = 'correct';
                remainingLetters[i] = null;
            }
        }

        // Vérifier les lettres présentes mais mal positionnées
        for (let i = 0; i < this.LETTERS; i++) {
            if (result[i]) continue;

            const index = remainingLetters.indexOf(guess[i]);
            if (index > -1) {
                result[i] = 'present';
                remainingLetters[index] = null;
            } else {
                result[i] = 'absent';
            }
        }

        // Mettre à jour les couleurs
        const cells = this.board.children[this.currentRow].children;
        result.forEach((status, i) => {
            cells[i].classList.add(status);
        });

        // Vérifier victoire/défaite
        if (guess === target) {
            this.gameOver = true;
            this.message.textContent = 'Bravo ! Vous avez gagné !';
            document.querySelector('.restart-btn').style.display = 'inline-block';
        } else if (this.currentRow === this.ROWS - 1) {
            this.gameOver = true;
            this.message.textContent = `Perdu ! Le mot était : ${this.targetWord}`;
            document.querySelector('.restart-btn').style.display = 'inline-block';
        } else {
            this.currentRow++;
            this.currentGuess = [];
        }
    }
}

// Démarrer le jeu
const game = new WordleGame();