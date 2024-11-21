// import { useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Modal from "./components/Modal";
import type { GameState, Player } from "./types";
import classNames from "classnames";
import { useLocalStorage } from "./useLocalStorage";
import { derivedGame, derivedStats } from "./utils";

export default function App() {
  const [state, setState] = useLocalStorage<GameState>("game-state-key", {
    moves: [],
    history: {
      currentRoundGames: [],
      allGames: [],
    },
  });

  //   NO-LOCAL-STORAGE
  //   const [state, setState] = useState<GameState>({
  //     moves: [],
  //     history: {
  //       currentRoundGames: [],
  //       allGames: [],
  //     },
  //   });

  const game = derivedGame(state);
  const stats = derivedStats(state);

  function resetGame(isNewRound: boolean) {
    setState((prev) => {
      const stateClone = structuredClone(prev);
      const { status, moves } = game;

      if (status.isComplete) {
        stateClone.history.currentRoundGames.push({
          moves,
          status,
        });
      }
      stateClone.moves = [];

      if (isNewRound) {
        // stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
        stateClone.history.currentRoundGames = [];
      }

      return stateClone;
    });
  }

  function handlePlayerMove(squareId: number, player: Player) {
    setState((prev) => {
      const stateClone = structuredClone(prev);
      stateClone.moves.push({
        squareId,
        player,
      });
      return stateClone;
    });
  }
  //   const showModal = false;

  return (
    <>
      <main>
        <div className="grid">
          <div className={classNames("turn", game.currentPlayer.colorClass)}>
            <i
              className={classNames("fa-solid", game.currentPlayer.iconClass)}
            ></i>
            <p>{game.currentPlayer.name}, you're up!</p>
          </div>

          <Menu
            onAction={(action) => {
              resetGame(action === "new-round");
            }}
          />

          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((squareId) => {
            const existingMove = game.moves.find(
              (allProps) => allProps.squareId === squareId
            );
            return (
              <div
                key={squareId}
                className="square shadow"
                onClick={() => {
                  if (existingMove) return;

                  handlePlayerMove(squareId, game.currentPlayer);
                }}
              >
                {existingMove && (
                  <i
                    className={classNames(
                      "fa-solid",
                      existingMove.player.colorClass,
                      existingMove.player.iconClass
                    )}
                  ></i>
                )}
              </div>
            );
          })}

          <div
            className="score shadow"
            style={{ backgroundColor: "var(--turquoise)" }}
          >
            <p>Player 1</p>
            <span>{stats.playerWithStats[0].wins} Wins</span>
          </div>

          <div
            className="score shadow"
            style={{ backgroundColor: "var(--light-gray)" }}
          >
            <p>Ties</p>
            <span>{stats.ties} Wins</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--yellow)" }}
          >
            <p>Player 2</p>
            <span>{stats.playerWithStats[1].wins} Wins</span>
          </div>
        </div>
      </main>

      <Footer />

      {game.status.isComplete && (
        <Modal
          message={game.status.winner ? game.status.winner.name : "Its a Tie!"}
          onClick={() => resetGame(false)}
        />
      )}
    </>
  );
}
