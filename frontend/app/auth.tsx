import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function verifyRefreshToken(router: AppRouterInstance) {
    try {
        const response = await fetch('http://localhost:5000/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        })
        const status = response.status
        if (response.ok) {
            console.log('hola')
            router.replace('/home')
        }
        else if (status == 401) {
            router.replace('/login')
        } else if (status == 500) {
            //Mostrar de que hubo un error en el servidor
        } else {
            //Mostrar de que hubo un error en el servidor
        }
    } catch (e) {
        //Mostrar que hubo un error en el servidor
    }
}

