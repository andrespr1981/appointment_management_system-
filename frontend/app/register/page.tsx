'use client'
import './register.css'
import { useRouter } from 'next/navigation'
export default function RegisterPage() {

  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')
    const lastName = formData.get('lastName')
    const email = formData.get('email')
    const tel = formData.get('tel')
    const password = formData.get('password')
    const confirmPassword = formData.get('comfirmPassword')

    if (password != confirmPassword) {
      return;
      //Mostrar un error de que que las contraseñas no coindicen
    }

    try {

      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          lastName: lastName,
          email: email,
          tel: tel,
          password: password
        }),
      })

      if (response.ok) {
        router.replace('/home')
      } else {
        const status = response.status
        const data = await response.json()
        const error = data.message
        if (status == 400) {
          //Todos los datos son requeridos
        } else if (status == 409) {
          //El correo ya esta registrado
        } else if (status == 500) {
          //error en la base de datos
        }
        //Mostrar un error de que un problema con la solicitud 
      }

    } catch (e) {
      //Mostrar un error de que un problema con la solicitud 
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Registro de Cliente</h1>
          <p className="register-subtitle">
            Cree su cuenta para agendar citas médicas
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre(s) *</label>
            <input
              type="text"
              name='name'
              placeholder="Ej. Juan Adolfo"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Apellidos *</label>
            <input
              type="text"
              name='lastName'
              placeholder="Ej. Pérez Flores"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Correo Electrónico *</label>
            <input
              type="email"
              name='email'
              placeholder="usuario@mail.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              name='tel'
              placeholder="555-0000"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña *</label>
            <input
              type="password"
              name='password'
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
              name='comfirmPassword'
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
