'use client'
import { useAuth } from '../authContext';
import './login.css'
import { useRouter } from 'next/navigation'
export default function page() {
  const { setAccessToken } = useAuth()

  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    if (!email) {
      //Ahi pones que el cuadrito donde se pone el correo se ponga rojo o algo asi 
      // y que cuando vuelva a escribir se quite el color rojo 
      //correo es requerido
    }
    if (!password) {
      // Igual con la contrase;a si no esta que se ponga rojo el cuadrito
      //password es requerida
    }

    try {

      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      })

      if (response.ok) {
        const data = await response.json()
        const role = data.role
        if (role == 'Administrador') {

        } else if (role == 'Paciente') {
          router.replace('/home')
        } else if (role == 'Especialista') {

        } else if (role == 'Recepcionista') {

        } else if (role == 'Auditor') {

        }
        setAccessToken(data.accessToken)
      } else {
        const status = response.status
        const data = await response.json()
        const error = data.message
        if (status == 400) {
          //correo y contraseña con requeridos
          //Que se pongan rojos 
        }
        else if (status == 404) {
          //Correo no encontrado
          //Que se ponga rojo el cuadrito y te ponga un mensaje de que no se encontro el correo
        }
        else if (status == 401) {
          //La contrase;a es incorrecta
          //Que se ponga rojo el cuadrito y te ponga un emnsaje de que ta mal 
        }
        else if (status == 500) {
          //Hubo un problema con la base de datos
          // Que salga un cuadrito rojo encima del email donde te ponga que hubo un error y que intente mas tarde
        } else {
          //Hubo un problema desconocido
        }
      }

    } catch (e) {
      //Mostrar un error igual al de arriba
      console.log(e)
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

          <button type='submit' className="primary-button">
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