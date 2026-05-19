"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { setAuthSession } from "@/lib/authSession";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";

const LoginForm = ({
  heading = "Fazer login",
  heading2 = "Bem-vindo",
  heading2azul = "de volta!",

  buttonText = "Entrar",
  className
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();
  const { mounted, theme } = useTheme();
  const logoSrc =
    mounted && theme === "dark"
      ? "/logoCleanlineEscuro.png"
      : "/logoCleanline.png";

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const res = await apiFetch("/api/auth", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();
      console.log(data.token)
      console.log(Object.keys(data))

      if (res.ok) {
        setAuthSession(data.token)
        localStorage.setItem("cleanline_token", data.token);
        setTimeout(() => {
          router.push("/homeAdm");
        }, 100)
        
      } else {
        setErro(data.erro);
      }
    } catch {
      setErro("Erro de conexao com o servidor.");
    }
  };

  return (
    <section className={cn("relative flex min-h-screen justify-center overflow-hidden bg-background", className)}>
      <img
        src="home-background-image.png"
        className="absolute z-1 mt-25 w-full opacity-90 dark:opacity-35"
        alt="background"
      />

      <div className="flex flex-col items-center mt-6 sm:mt-10 md:mt-20 justify-self-center gap-6 sm:gap-8 md:gap-16 lg:gap-37 lg:justify-start z-2 px-4 sm:px-0">
        <img
          src={logoSrc}
          alt="logo"
          className="h-8 sm:h-10 md:h-12 scale-100 sm:scale-120 md:scale-170 lg:scale-170 justify-self-center" />

        <form
          onSubmit={handleLogin}
          className="flex w-full max-w-xs sm:max-w-sm md:max-w-sm flex-col items-center gap-y-4 rounded-md border border-border bg-card px-4 sm:px-6 py-6 sm:py-8 text-card-foreground shadow-2xl scale-100 sm:scale-100 md:scale-120 lg:scale-140">

          <div className=" flex flex-col items-center gap-0.5  ">
            {heading && <h1 className=" text-xl sm:text-2xl md:text-3xl font-semibold mb-0 ">{heading}</h1>}
            <div className=" flex justify-center gap-1.5 ">
              {heading2 && <h1 className=" text-lg sm:text-xl md:text-2xl font-semibold mt-0 ">{heading2}</h1>}
              {heading2azul && <h1 className=" text-lg sm:text-xl md:text-2xl font-semibold mt-0 text-[#24bff6] ">{heading2azul}</h1>}
            </div>
          </div>

          {erro && <p className="text-red-500 text-sm font-medium w-full text-center">{erro}</p>}

          <Input
            type="email"
            placeholder="Email"
            className="bg-background/80 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-[#24bff6] focus-visible:ring-[#24bff6]"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="login-password-input bg-background/80 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-[#24bff6] focus-visible:ring-[#24bff6]"
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
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <Button type="submit" className="h-9 sm:h-10 w-40 sm:w-48 md:w-50 bg-primary text-base sm:text-lg text-primary-foreground hover:brightness-110">
            {buttonText}
          </Button>
        </form>
      </div>
    </section>
  );
};

export { LoginForm };
