"use client";

import { useState, useEffect } from "react";
import "./especialista.css";

export default function Especialista() {
  const [tab, setTab] = useState("hoy");
  const [citas, setCitas] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/citas/especialista")
      .then(res => res.json())
      .then(data => setCitas(data))
      .catch(() => setCitas([]));
  }, []);


  return (
    <div className="page">
      <div className="container">

        {/* HEADER */}
        <div className="header">
          <h1>Panel Especialista</h1>
          <button className="btn-logout">Cerrar sesión</button>
        </div>

        {/* TABS */}
        <div className="tabs">
          <button className={tab === "hoy" ? "active" : ""} onClick={() => setTab("hoy")}>
            Hoy
          </button>
          <button className={tab === "proximas" ? "active" : ""} onClick={() => setTab("proximas")}>
            Próximas
          </button>
          <button className={tab === "historial" ? "active" : ""} onClick={() => setTab("historial")}>
            Historial 
          </button>
        </div>

        {/* CONTENIDO */}
        {citas.length === 0 ? (
          <div className="empty">
            <p>No hay citas disponibles</p>
          </div>
        ) : (
          <div className="grid">
            {citas.map((c) => (
              <div key={c.id} className="card">
                <h3>{c.paciente}</h3>
                <p><b>Fecha:</b> {c.fecha}</p>
                <p><b>Hora:</b> {c.hora}</p>
                <p><b>Motivo:</b> {c.motivo}</p>

                {tab !== "historial" && (
                  <button className="btn-cancel">
                    Cancelar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}