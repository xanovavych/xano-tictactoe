import type { GameState, Player } from "./types";

export const players: Player[] = [
  { id: 1, name: "Player 1", iconClass: "fa-x", colorClass: "turquoise" },
  { id: 2, name: "Player 2", iconClass: "fa-o", colorClass: "yellow" },
];

export function derivedGame(state: GameState) {
  // const mubs = state.moves?.length ?? 0;
  const currentPlayer = players[state.moves.length % 2];

  const winningPatterns = [
    [1, 2, 3],
    [1, 5, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 5, 7],
    [3, 6, 9],
    [4, 5, 6],
    [7, 8, 9],
  ];
  let winner = null;

  for (const clickPlayer of players) {
    const hiwalayP1P2 = state.moves.filter(
      (allProps) => allProps.player.id === clickPlayer.id
    );
    const movesOnly = hiwalayP1P2.map((allProps) => allProps.squareId);
    for (const eachWPatt of winningPatterns) {
      if (eachWPatt.every((allProps) => movesOnly.includes(allProps))) {
        winner = clickPlayer;
      }
    }
  }
  // console.log(winner, "winner");

  return {
    moves: state.moves,
    currentPlayer,
    status: {
      isComplete: winner != null || state.moves.length === 9,
      winner,
    },
  };
}

export function derivedStats(state: GameState) {
  const tieGame = state.history.currentRoundGames.filter(
    (allProps) => allProps.status.winner === null
  ).length;
  const playerWinner = players.map((p1LoopthenP2) => {
    const wins = state.history.currentRoundGames.filter(
      (allProps) => allProps.status.winner?.id === p1LoopthenP2.id
    ).length;
    return {
      ...p1LoopthenP2,
      wins,
    };
  });
  return {
    playerWithStats: playerWinner,
    ties: tieGame,
  };
}
