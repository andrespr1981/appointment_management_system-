'use client'
import { useState } from 'react'
import './admin.css'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('usuarios')
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const [users] = useState([
    { id: 1, name: 'Juan Pérez', email: 'cliente@mail.com', tel: '555-0101', role: 'Cliente', spec: '-' },
    { id: 2, name: 'María García', email: 'admin@mail.com', tel: '555-0102', role: 'Administrador', spec: '-' },
    { id: 3, name: 'Carlos López', email: 'recepcion@mail.com', tel: '555-0103', role: 'Recepcionista', spec: '-' },
    { id: 4, name: 'Dr. Ana Martínez', email: 'especialista@mail.com', tel: '555-0104', role: 'Especialista', spec: 'Cardiología' },
  ])

  return (
    <div className="admin-layout">

      {/* HEADER */}
      <header className="admin-header">
        <div className="user-brand">
          <h1>Panel de Administración</h1>
          <span style={{fontSize: '0.8rem', color: '#64748b'}}>María García</span>
        </div>
        <button className="logout-trigger" onClick={() => setShowLogoutModal(true)}>
          Cerrar Sesión
        </button>
      </header>

      <main className="admin-container">
        {/* KPI CARDS */}
        <section className="kpi-grid">
          <div className="kpi-card"><span>Total Usuarios</span> <strong>6</strong></div>
          <div className="kpi-card"><span>Citas Agendadas</span> <strong>2</strong></div>
          <div className="kpi-card"><span>Ingresos Totales</span> <strong>$110K</strong></div>
          <div className="kpi-card"><span>Pagos Pendientes</span> <strong>1</strong></div>
        </section>

        {/* TABS */}
        <nav className="tab-nav">
          <button className={activeTab === 'usuarios' ? 'active' : ''} onClick={() => setActiveTab('usuarios')}>Usuarios</button>
          <button className={activeTab === 'citas' ? 'active' : ''} onClick={() => setActiveTab('citas')}>Citas</button>
          <button className={activeTab === 'pagos' ? 'active' : ''} onClick={() => setActiveTab('pagos')}>Pagos</button>
        </nav>

        {/* TABLA DE USUARIOS */}
        {activeTab === 'usuarios' && (
          <section className="content-card">
            <div className="card-header">
              <h2>Gestión de Usuarios</h2>
              <button className="black-btn" onClick={() => setShowRegisterModal(true)}>+ Registrar Usuario</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Rol</th><th>Especialidad</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.tel}</td>
                    <td><span className={`role-tag ${u.role.toLowerCase()}`}>{u.role}</span></td>
                    <td>{u.spec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>

      {/* CERRAR SESIÓN */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-x-btn" onClick={() => setShowLogoutModal(false)}>❌</button>
            <h3>¿Cerrar sesión?</h3>
            <p>Estás a punto de salir del panel administrativo.</p>
            <div className="modal-actions">
              <button className="no-btn" onClick={() => setShowLogoutModal(false)}>Cancelar</button>
              <button className="yes-btn-red" onClick={() => window.location.href='/login'}>Salir</button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTRO */}
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-x-btn" onClick={() => setShowRegisterModal(false)}>❌</button>
            <h3 className="modal-title">Registrar Nuevo Usuario</h3>
            <form className="modal-form">
              <div className="input-group">
                <label>Nombre(s)</label>
                <input type="text" placeholder="Ej: Juan Adolfo" />
              </div>
              <div className="input-group">
                <label>Correo Electrónico</label>
                <input type="email" placeholder="usuario@mail.com" />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Teléfono</label>
                  <input type="text" placeholder="555-0000" />
                </div>
                <div className="input-group">
                  <label>Rol</label>
                  <select>
                    <option>Cliente</option>
                    <option>Especialista</option>
                    <option>Administrador</option>
                    <option>Recepcionista</option>
                  </select>
                </div>
              </div>
              <button type="button" className="submit-btn">Registrar Usuario</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}