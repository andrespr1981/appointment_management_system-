export default function RegisterPage() {
  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Registro de Cliente</h1>
          <p className="register-subtitle">
            Cree su cuenta para agendar citas médicas
          </p>
        </div>

        <form className="register-form">
          <div className="form-group">
            <label className="form-label">Nombre(s) *</label>
            <input
              type="text"
              placeholder="Ej. Juan Adolfo"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Apellidos *</label>
            <input
              type="text"
              placeholder="Ej. Pérez Flores"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Correo Electrónico *</label>
            <input
              type="email"
              placeholder="usuario@mail.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              placeholder="555-0000"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña *</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="form-input"
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Contraseña *</label>
            <input
              type="password"
              placeholder="Repita su contraseña"
              className="form-input"
              required
            />
          </div>

          <button className="primary-button">
            Registrarse
          </button>
        </form>

        <p className="register-footer-text">
          <a href="/login" className="text-link">
            ← Volver al inicio de sesión
          </a>
        </p>
      </div>
    </div>
  );
}
