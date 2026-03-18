'use client'
import { useState } from 'react'
import './home.css'

export default function HomePage() {
  const [openModal, setOpenModal] = useState(false)

  async function getSpecialities() {
    try {
      const response = await fetch('http://localhost:5000/specialities', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        const data = await response.json()
        const specialities = data.specialities
      }

    } catch (e) {
      //Mostrar un cuadrito rojo de que algo salio mal
    }
  }

  async function getSpecialistsBySpeciality(specialityID: Number) {
    try {
      const response = await fetch(`http://localhost:5000/specialities/id=${specialityID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        const data = await response.json()
        const specialists = data.specialists
      }

    } catch (e) {
      //Mostrar un cuadrito rojo de que algo salio mal
    }
  }

  function handleAddAppointButton() {
    getSpecialities()
    setOpenModal(true)
  }

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Ana Martínez',
      specialty: 'Cardiología',
      date: '2026-03-09',
      time: '09:00',
      reason: 'Consulta general',
      paid: true,
    }
  ])

  const [form, setForm] = useState({
    doctor: '',
    specialty: '',
    date: '',
    time: '',
    reason: '',
    paid: false
  })

  // AGREGAR CITA
  async function handleAddAppointment(e: React.SubmitEvent<HTMLFormElement>) {

  }

  // ELIMINAR CITA
  const handleDelete = (id: number) => {
    const confirmDelete = confirm('¿Seguro que deseas cancelar la cita?')

    if (confirmDelete) {
      setAppointments(appointments.filter(a => a.id !== id))
    }
  }

  return (
    <div className="home-page">

      <h1 className="home-title">Panel del Cliente</h1>

      {/* BOTON */}
      <button
        className="primary-button"
        onClick={() => { handleAddAppointButton() }}
      >
        + Agendar Cita
      </button>

      {/* LISTA */}
      <div className="section">
        <h2>Próximas Citas</h2>

        {appointments.map((a) => (
          <div key={a.id} className="appointment-card">
            <p><strong>{a.doctor}</strong> - {a.specialty}</p>
            <p>{a.date}</p>
            <p>{a.time}</p>
            <p>{a.reason}</p>

            {/* ESTADO PAGO */}
            <p className={a.paid ? 'paid' : 'not-paid'}>
              {a.paid ? 'Pagado' : 'No pagado'}
            </p>

            <div className="appointment-actions">
              <button
                className="secondary-button"
                onClick={() =>
                  setAppointments(appointments.map(item =>
                    item.id === a.id
                      ? { ...item, paid: !item.paid }
                      : item
                  ))
                }
              >
                Cambiar estado
              </button>

              <button
                className="danger-button"
                onClick={() => handleDelete(a.id)}
              >
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="modal-overlay">
          <div className="modal-card">

            <h2>Agendar Cita</h2>

            <form action="" onSubmit={handleAddAppointment}>
              <input
                className="form-input"
                placeholder="Doctor"
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
              />

              <input
                className="form-input"
                placeholder="Especialidad"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              />

              <input
                type="date"
                className="form-input"
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />

              <input
                type="time"
                className="form-input"
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />

              <textarea
                className="form-input"
                placeholder="Motivo"
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />

              {/* CHECK PAGADO */}
              <label>
                <input
                  type="checkbox"
                  checked={form.paid}
                  onChange={(e) =>
                    setForm({ ...form, paid: e.target.checked })
                  }
                />
                Pagado
              </label>

              <button
                type='submit'
                className="primary-button"
              >
                Confirmar Cita
              </button>

              <button onClick={() => setOpenModal(false)}>
                Cerrar
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}