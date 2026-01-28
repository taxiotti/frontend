import { useEffect, useState } from "react";

export default function App() {
  const [ws, setWs] = useState(null);
  const [joined, setJoined] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState(null);
  const [hostId, setHostId] = useState(null);
  const [players, setPlayers] = useState([]);

  const [gameState, setGameState] = useState("LOBBY");
  const [enigma, setEnigma] = useState(null);
  const [timer, setTimer] = useState(0);

  const [freeChat, setFreeChat] = useState([]);
  const [answerChat, setAnswerChat] = useState([]);
  const [freeInput, setFreeInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");

  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "connected") {
        setPlayerId(msg.player_id);
        setHostId(msg.host_id);
        setPlayers(msg.players);
        setGameState(msg.game_state);
      }

      if (msg.type === "players_update") {
        setPlayers(msg.players);
        setHostId(msg.host_id);
        setGameState(msg.game_state);
      }

      if (msg.type === "game_started" || msg.type === "new_enigma") {
        setGameState("IN_GAME");
        setEnigma(msg.enigma);
      }

      if (msg.type === "timer") setTimer(msg.remaining);

      if (msg.type === "chat_free")
        setFreeChat((p) => [...p, msg]);

      if (msg.type === "chat_answer")
        setAnswerChat((p) => [...p, msg]);

      if (msg.type === "correct_answer")
        setAnswerChat((p) => [
          ...p,
          { system: true, message: "✔ Resposta correta" }
        ]);

      if (msg.type === "game_finished")
        setGameState("FINISHED");
    };

    return () => ws.close();
  }, [ws]);

  /* ================================
     TELA DE ENTRADA (NOME)
     ================================ */
  if (!joined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
<div className="bg-zinc-900/80 border border-zinc-800 p-10 rounded-2xl w-96 text-center space-y-6 backdrop-blur">
  <h2 className="text-2xl font-semibold tracking-wide text-amber-400">
    Identifique-se
  </h2>

  <p className="text-sm text-zinc-400">
    Seu nome será exibido no chat da investigação
  </p>

  <input
    value={playerName}
    onChange={(e) => setPlayerName(e.target.value)}
    placeholder="Ex: Maycow me dá 10 em PLEASE ksksks"
    className="text-center text-lg"
  />

          <button
            disabled={!playerName.trim()}
            onClick={() => {
              const socket = new WebSocket("wss://connected-game.onrender.com/ws");

              socket.onopen = () => {
                socket.send(
                  JSON.stringify({
                    type: "join",
                    name: playerName
                  })
                );
              };

              setWs(socket);
              setJoined(true);
            }}
          >
            <button className="w-full text-lg">
              Entrar no jogo
            </button>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* HEADER */}
      <header className="border-b border-zinc-800 px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-wide">
            O Último Relato
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Jogadores conectados: {players.length}
          </p>
        </div>

        {gameState === "IN_GAME" && (
          <div className="text-red-400 font-mono text-xl">
            {timer}s
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-3 gap-10">
        {/* ENIGMA */}
        <section className="col-span-2">
          {gameState === "LOBBY" && (
            <div className="mt-32 text-center space-y-6">
              <p className="text-zinc-400 text-lg">
                Aguardando início da investigação
              </p>

              {playerId === hostId && (
                <button
                  onClick={() =>
                    ws.send(JSON.stringify({ type: "start_game" }))
                  }
                >
                  Iniciar jogo
                </button>
              )}
            </div>
          )}

          {gameState === "IN_GAME" && enigma && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-amber-400">
                {enigma.title}
              </h2>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 whitespace-pre-line">
                {enigma.story}
              </div>

              <p className="text-lg font-medium text-red-300">
                {enigma.question}
              </p>
            </div>
          )}

          {gameState === "FINISHED" && (
            <div className="mt-32 text-center space-y-4">
              <h2 className="text-4xl font-semibold text-green-400">
                Caso encerrado
              </h2>
            </div>
          )}
        </section>

        {/* CHAT */}
        <section className="space-y-10">
          {/* CHAT LIVRE */}
          <div>
            <h3 className="text-sm uppercase text-zinc-500 mb-3">
              Chat livre
            </h3>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl h-64 p-4 overflow-y-auto space-y-2 text-sm">
              {freeChat.map((m, i) => (
                <p key={i}>
                  <span className="text-amber-400 font-medium">
                    {m.player_name}:
                  </span>{" "}
                  {m.message}
                </p>
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              <input
                value={freeInput}
                onChange={(e) => setFreeInput(e.target.value)}
                placeholder="Mensagem livre"
              />
              <button
                onClick={() => {
                  ws.send(
                    JSON.stringify({
                      type: "chat_free",
                      message: freeInput
                    })
                  );
                  setFreeInput("");
                }}
              >
                Enviar
              </button>
            </div>
          </div>

          {/* RESPOSTAS */}
          <div>
            <h3 className="text-sm uppercase text-zinc-500 mb-3">
              Respostas
            </h3>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl h-64 p-4 overflow-y-auto space-y-2 text-sm">
              {answerChat.map((m, i) => (
                <p key={i}>
                  {m.system ? (
                    <span className="text-green-400">
                      {m.message}
                    </span>
                  ) : (
                    <>
                      <span className="text-amber-400 font-medium">
                        {m.player_name}:
                      </span>{" "}
                      {m.message}
                    </>
                  )}
                </p>
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              <input
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Responder enigma"
              />
              <button
                onClick={() => {
                  ws.send(
                    JSON.stringify({
                      type: "chat_answer",
                      message: answerInput
                    })
                  );
                  setAnswerInput("");
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
