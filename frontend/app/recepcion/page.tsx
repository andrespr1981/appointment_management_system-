"use client";

import { useState, useEffect } from "react";
import "./recepcion.css";

export default function Recepcion() {
  const [citas, setCitas] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/citas")
      .then(res => res.json())
      .then(data => setCitas(data))
      .catch(() => setCitas([]));
  }, []);

  return (
    <div className="page">
      <div className="container">

        {/* HEADER */}
        <div className="header">
          <h1>Panel Recepción</h1>
          <button className="btn-logout">Cerrar sesión</button>
        </div>

        {/* ACCIONES */}
        <div className="actions">
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Agendar cita
          </button>
        </div>

        {/* CONTENIDO */}
        {citas.length === 0 ? (
          <div className="empty">
            <p>No hay citas registradas</p>
          </div>
        ) : (
          <div className="grid">
            {citas.map((c) => (
              <div key={c.id} className="card">
                <h3>{c.paciente}</h3>
                <p><b>Especialista:</b> {c.especialista}</p>
                <p><b>Fecha:</b> {c.fecha}</p>
                <p><b>Hora:</b> {c.hora}</p>

                <button className="btn-pay">
                  Confirmar pago
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Agendar cita</h2>

            <input placeholder="Paciente" />
            <input placeholder="Especialista" />
            <input type="date" />
            <input type="time" />
            <input placeholder="Motivo" />

            <button className="btn-primary">Confirmar</button>

            <button
              className="btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}