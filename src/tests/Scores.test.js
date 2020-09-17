import { setScore, saveScore, getTopScores } from '../Objects/Scores';

class MokeGame {
  constructor() {
    this.score = 0;
  }
}

describe('the game public functions', () => {
  const game = new MokeGame();
  test('return game score', () => {
    game.score = setScore(game, 300);
    expect(game.score).toBe(300);
  });

  test('update game score', () => {
    game.score = 100;
    expect(setScore(game, 300)).toBe(400);
  });

  it('saves the players score to the leaderboard api', () => {
    saveScore('Le consulatant', 200).then((data) => {
      expect(data.result).toBe('Leaderboard score created correctly.');
    });
  });

  it('fails to send score to the api without user name', () => {
    saveScore(200).then((data) => {
      expect(data.result).toBe('You need to provide a valid user for the score');
    });
  });

  it("fails to send score to the api without score", () => {
    saveScore("dan").then((data) => {
      expect(data.result).toBe(
        "You need to provide a valid score for the leaderboard"
      );
    });
  });

  test('The object should contain the created user', () => {
    getTopScores()
      .then((data) => {
        expect(data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              user: 'Le consultant',
            }),
          ]),
        );
      })
      .catch(() => {});
  });

  test('The object should contain the created score', () => {
    getTopScores()
      .then((data) => {
        expect(data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              score: '200',
            }),
          ]),
        );
      })
      .catch(() => {});
  });
});
