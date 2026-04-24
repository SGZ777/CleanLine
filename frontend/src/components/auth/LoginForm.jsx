"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation"; // <<< Importamos o router pra mudar de tela
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const LoginForm = ({
  heading = "Fazer login",
  heading2 = "Bem-vindo",
  heading2azul = "de volta!",

  logo = {
    src: "logoCleanline.png",
    alt: "logo",
    title: "shadcnblocks.com",
  },

  buttonText = "Entrar",
  className
}) => {
  // login
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const res = await apiFetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("cleanline_token", data.token);
        router.push("/homeAdm"); //  Caminho para onde vai depois de logar
      } else {
        setErro(data.erro);
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    }
  };
  // -------------------------------------------

  return (
    <section className={cn("h-screen bg-muted flex justify-center ", className)}>
      <img src="home-background-image.png" className="w-full absolute mt-25 z-1" alt="background" />

      <div className="flex flex-col items-center mt-10 justify-self-center md:mt-20 gap-8 md:gap-16 lg:gap-37 lg:justify-start z-2">
        <img
          src={logo.src}
          alt={logo.alt}
          title={logo.title}
          className="h-10 scale-170 justify-self-center" />
          
        {/*troquei a div por um form */}
        <form
          onSubmit={handleLogin}
          className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-white px-6 py-8 shadow-md md:scale-120 lg:scale-140">
          
          <div className=" flex flex-col items-center gap-0.5  ">
            {heading && <h1 className=" text-3xl font-semibold mb-0 ">{heading}</h1>}
            <div className=" flex justify-center gap-1.5 ">
              {heading2 && <h1 className=" text-2xl font-semibold mt-0 ">{heading2}</h1>}
              {heading2azul && <h1 className=" text-2xl font-semibold mt-0 text-[#24bff6] ">{heading2azul}</h1>}
            </div>
          </div>

          {/* mostra o erro caso a senha esteja errado */}
          {erro && <p className="text-red-500 text-sm font-medium w-full text-center">{erro}</p>}

          
          <Input 
            type="email" 
            placeholder="Email" 
            className="text-sm focus-visible:border-[#24bff6] focus-visible:ring-[#24bff6]" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative w-full">
            
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="text-sm focus-visible:border-[#24bff6] focus-visible:ring-[#24bff6] pr-10"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff color="white" className="h-4 w-4" />
              ) : (
                <Eye color="white" className="h-4 w-4" />
              )}
            </button>
          </div>

          <Button type="submit" className="w-50 h-10 text-lg text-white bg-[#24bff6]">
            {buttonText}
          </Button>
        </form>
      </div>
    </section>
  );
};

export { LoginForm };
