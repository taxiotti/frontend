// src/components/RolePanel.jsx
export default function RolePanel({ role }) {
  if (role === "ANALISTA") {
    return (
      <div>
        <h3>Regras</h3>
        <ul>
          <li>Dígito 1 é par</li>
          <li>Dígito 2 &gt; 5</li>
          <li>Ordem importa</li>
        </ul>
      </div>
    );
  }

  if (role === "OBSERVADOR") {
    return (
      <div>
        <h3>Sequência Visual</h3>
        <p>🔺 🔴 🔵</p>
      </div>
    );
  }

  if (role === "COMUNICADOR") {
    return (
      <div>
        <h3>Alertas</h3>
        <p>Módulo central instável</p>
      </div>
    );
  }

  return null;
}
