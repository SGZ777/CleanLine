"use client"; 

import { useRouter } from "next/navigation"; 

export default function HeaderAdm() {
  const router = useRouter(); 

  
  const handleLogout = () => {
   //apaga o token ( desloga)
    localStorage.removeItem("cleanline_token");
    
    //manda pro login
    router.push("/login"); 
  };

  return (
    <header className="w-auto h-auto flex items-center justify-between bg-white p-4">
      <img
        src="logoCleanline.png"
        className="w-80 lg:ps-15 sm:ps-0 pt-5"
        alt="Cleanline"
      />
      <p className="text-center text-2xl text-[#0d005d]">Área de administrador</p>
      
      
      <button 
        onClick={handleLogout} 
        className="hover:opacity-75 transition-opacity"
        title="Sair do sistema"
      >
        <img 
          src="icon_logout.png" 
          className="w-8 me-10 cursor-pointer" 
          alt="Logout"
        />
      </button>
    </header>
  );
}