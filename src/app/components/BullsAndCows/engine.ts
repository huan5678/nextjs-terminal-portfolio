
export type GuessResult = {
  guess: string;
  bulls: number;
  cows: number;
};

export class BullsAndCowsEngine {
  private secretCode: string;
  public attempts: number;
  public maxAttempts: number;
  public history: GuessResult[];
  public isGameOver: boolean;
  public isGameWon: boolean;

  constructor(codeLength = 4, maxAttempts = 10) {
    this.secretCode = this.generateSecretCode(codeLength);
    this.attempts = 0;
    this.maxAttempts = maxAttempts;
    this.history = [];
    this.isGameOver = false;
    this.isGameWon = false;
  }

  private generateSecretCode(length: number): string {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let secret = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      secret += digits.splice(randomIndex, 1)[0];
    }
    return secret;
  }

  public submitGuess(guess: string): GuessResult | null {
    if (this.isGameOver || guess.length !== this.secretCode.length || !/^\d+$/.test(guess)) {
      return null;
    }

    let bulls = 0;
    let cows = 0;
    const secretCodeArray = this.secretCode.split('');
    const guessArray = guess.split('');

    // Check for bulls
    for (let i = 0; i < guessArray.length; i++) {
      if (guessArray[i] === secretCodeArray[i]) {
        bulls++;
      }
    }

    // Check for cows
    for (let i = 0; i < guessArray.length; i++) {
      if (secretCodeArray.includes(guessArray[i]) && guessArray[i] !== secretCodeArray[i]) {
        cows++;
      }
    }

    const result: GuessResult = { guess, bulls, cows };
    this.history.push(result);
    this.attempts++;

    if (bulls === this.secretCode.length) {
      this.isGameWon = true;
      this.isGameOver = true;
    } else if (this.attempts >= this.maxAttempts) {
      this.isGameOver = true;
    }

    return result;
  }

  public getSecretCode(): string {
    return this.secretCode;
  }

  private calculateScore(): number {
    const baseScore = 1000;
    const penalty = (this.attempts - 1) * 50;
    return Math.max(10, baseScore - penalty);
  }
}
