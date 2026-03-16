'use client'
import './login.css'
import { useRouter } from 'next/navigation'
export default function page() {

  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    })

    if (response.ok) {
      router.push('/home')
    } else {
      //Mostrar un error 
    }

  }

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

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              name='email'
              placeholder="usuario@mail.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name='password'
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