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
          <div
            className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md">
            {heading && <h1 className="text-3xl font-semibold">{heading}</h1>}
            <div className=" flex justify-center gap-1.5 ">
              <h2 className=" text-xl ">{description}</h2>
              <h2 className=" text-xl ">{description2}</h2>

            </div>

            <Input type="email" placeholder="Email corporativo" className="text-sm" required />
            <Input type="password" placeholder="Senha" className="text-sm" required />
            <Button type="submit" className=" w-60 h-11 text-lg ">
              {buttonText}
            </Button>
          </div>
          <div className="flex justify-center gap-1 text-sm text-muted-foreground">


          </div>
        </div>
      </div>
    </section>
  );
};

export { Login1 };
