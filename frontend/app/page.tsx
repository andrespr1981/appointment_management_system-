"use client";
import { ThreeDots } from 'react-loader-spinner';
//Comando para ejecutar frontend: npm run dev
export default function Home() {

  //Me quede haciendo la fucnion para detectar si el usuario esta logeado o no, con el acesss token o el refresh toekn

  return (
    <div>
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#1ed9ff"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
