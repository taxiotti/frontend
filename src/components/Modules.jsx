// src/components/Modules.jsx
export default function Modules({ send, role }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Módulos</h3>

      {role === "OPERADOR" && (
        <>
          <button onClick={() => send({ type: "PANEL_SUBMIT", value: "7" })}>7</button>
          <button onClick={() => send({ type: "PANEL_SUBMIT", value: "2" })}>2</button>
          <button onClick={() => send({ type: "PANEL_SUBMIT", value: "6" })}>6</button>
        </>
      )}

      {role === "COMUNICADOR" && (
        <button onClick={() => send({ type: "VALIDATE" })}>
          Confirmar Validação
        </button>
      )}
    </div>
  );
}
