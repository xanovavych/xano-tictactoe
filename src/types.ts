export type Player = {
  id: number;
  name: string;
  iconClass: string;
  colorClass: string;
};

export type PlayerWithWins = Player & { wins: number };
export type DerivedStats = {
  playerWithStats: PlayerWithWins[];
  ties: number;
};

export type GameStatus = {
  isComplete: boolean;
  winner: Player | null;
};

export type Move = {
  squareId: number;
  player: Player;
};

export type DerivedGame = {
  moves: Move[];
  currentPlayer: Player;
  status: GameStatus;
};

export type PushedGame = {
  moves: Move[];
  status: GameStatus;
};

export type GameState = {
  moves: Move[];
  history: {
    currentRoundGames: PushedGame[];
    allGames: PushedGame[];
  };
};
