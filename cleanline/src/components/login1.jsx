"use client"; // <<< 1. Obrigatório para usar states e funções no Next.js

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Login1 = ({
  heading = "Fazer login",
  description = "Bem-vindo",
  description2 = "de volta!",
  buttonText = "Entrar",
  className
}) => {

  // 2. Criando as memórias (estados) do formulário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  // 3. A função que avisa a nossa API quando o botão é clicado
  const handleLogin = async (e) => {
    e.preventDefault(); // Impede a página de piscar/recarregar
    setErro("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        // Guarda o "crachá" do admin no navegador
        localStorage.setItem("cleanline_token", data.token);
        // Redireciona pra página do sistema
        router.push("/dashboard"); 
      } else {
        setErro(data.erro); // Mostra o erro ("Email incorreto", etc)
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    }
  };

  return (
    <section className={cn("h-screen bg-muted justify-center flex flex-col ", className)}>

      <div className=" self-center h-0 ">
        <img
          src="logoCleanline.png"
          className="img-logo-header sm:scale-50 md:scale-20 self-center "
          alt="Cleanline"
        />
      </div>
      <div className="flex flex-col h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 lg:justify-start md:scale-140 ">
          
          {/* 4. Trocamos a <div> principal por um <form> e colocamos o onSubmit */}
          <form 
            onSubmit={handleLogin}
            className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md"
          >
            {heading && <h1 className="text-3xl font-semibold">{heading}</h1>}
            <div className=" flex justify-center gap-1.5 ">
              <h2 className=" text-xl ">{description}</h2>
              <h2 className=" text-xl ">{description2}</h2>
            </div>

            {/* Aviso de erro (só aparece se o login der ruim) */}
            {erro && <p className="text-red-500 text-sm font-medium w-full text-center">{erro}</p>}

            {/* 5. Ligamos os Inputs no useState usando value e onChange */}
            <Input 
              type="email" 
              placeholder="Email corporativo" 
              className="text-sm w-full border-1 text-[2px]" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input 
              type="password" 
              placeholder="Senha" 
              className="text-sm w-full" 
              required 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            
            <Button type="submit" className=" w-60 h-11 bg-[#24bff6] text-white text-lg ">
              {buttonText}
            </Button>
          </form>

          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
          </div>
        </div>
      </div>
    </section>
  );
};

export { Login1 };