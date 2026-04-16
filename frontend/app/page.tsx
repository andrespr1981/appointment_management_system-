"use client";
import { useEffect } from "react";
import { ThreeDots } from 'react-loader-spinner';
import { verifyRefreshToken } from "./auth";
import { useRouter } from "next/navigation";
//Comando para ejecutar frontend: npm run dev
export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const statusAsync = async () => {
      await verifyRefreshToken(router)
    }
    statusAsync()
  }, [])

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
