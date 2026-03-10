import './login.css'
export default function page() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">
            Sistema de Gestión de Citas Médicas
          </h1>
          <p className="login-subtitle">
            Ingrese su correo para acceder al sistema
          </p>
        </div>

        <form className="login-form">
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              placeholder="usuario@mail.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              className="form-input"
              required
            />
          </div>

          <button className="primary-button">
            Iniciar Sesión
          </button>
        </form>

        <p className="login-footer-text">
          ¿No tiene cuenta?{' '}
          <a href="/register" className="text-link">
            Regístrese aquí
          </a>
        </p>
      </div>
    </div>
  );
}