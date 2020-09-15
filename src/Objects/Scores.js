const key = "1f85Mn08h0tC7D6tcNh4";
const url =
  `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${key}/scores/`;

export function setScore(game, data) {
  return game.score + data;
}

export async function saveScore(score, name) {
  const data = {
    method: 'POST',
    headers: {
      Accept: 'Application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      score,
    }),
  };
}

export async function getTopScores() {
    const res = await fetch(url)
    const data = await res.json()
    return data
}
