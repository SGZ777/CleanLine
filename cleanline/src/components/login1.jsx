"use client"; // <<< 1. Obrigatório: avisa o Next.js que essa tela tem interatividade

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Login1 = ({
  heading = "Fazer login",
  heading2 = "Bem-vindo de volta!",
  logo = {
    src: "logoCleanline.png",
    alt: "logo",
    title: "shadcnblocks.com",
  },
  buttonText = "Login",
  className
}) => {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  
  const handleLogin = async (e) => {
    e.preventDefault(); // previne a pagina de carregar
    setErro(""); // Limpa erros antigos

    try {
      // Chama a rota criada com o db
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        // Se a senha bater com o Hash, guarda o token e vai pro painel!
        localStorage.setItem("cleanline_token", data.token);
        router.push("/dashboard"); 
      } else {
        // Se errar a senha, mostra a mensagem vermelha
        setErro(data.erro); 
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    }
  };

  return (
    <section className={cn("h-screen bg-muted flex justify-center", className)}>
      <div className="flex flex-col items-center mt-10 justify-self-center md:mt-20 gap-8 md:gap-16 lg:justify-start">
        <img
          src={logo.src}
          alt={logo.alt}
          title={logo.title}
          className="h-10 scale-150 justify-self-center"
        />
        
        {/* 4. TROCAMOS A <DIV> POR UM <FORM> E LIGAMOS A FUNÇÃO DE SUBMIT */}
        <form
          onSubmit={handleLogin}
          className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md md:scale-120"
        >
          {heading && <h1 className=" text-3xl font-semibold">{heading}</h1>}
          {heading2 && <h1 className=" text-2xl font-semibold">{heading2}</h1>}

          {/* MENSAGEM DE ERRO (Só aparece se errar a senha) */}
          {erro && <p className="text-red-500 text-sm font-medium w-full text-center">{erro}</p>}

          {/* 5. LIGAMOS OS INPUTS NAS VARIÁVEIS USANDO value e onChange */}
          <Input 
            type="email" 
            placeholder="Email" 
            className="text-sm focus-visible:border-black focus-visible:ring-black" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Input 
            type="password" 
            placeholder="Senha" 
            className="text-sm focus-visible:border-blue-500" 
            required 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          
          <Button type="submit" className="w-50 h-10 text-lg">
            {buttonText}
          </Button>
        </form>
      </div>
    </section>
  );
};

export { Login1 };