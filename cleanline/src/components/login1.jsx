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
  return (
    <section className={cn("h-screen bg-muted flex justify-center", className)}>

      <div className="flex flex-col items-center mt-10 justify-self-center md:mt-20 gap-8 md:gap-16 lg:justify-start">
        <img
          src={logo.src}
          alt={logo.alt}
          title={logo.title}
          className="h-10 scale-150 justify-self-center"/>
        <div
          className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md md:scale-120">
          {heading && <h1 className=" text-3xl font-semibold">{heading}</h1>}
          {heading2 && <h1 className=" text-2xl font-semibold">{heading2}</h1>}
          <Input type="email" placeholder="Email" className="text-sm focus-visible:border-black focus-visible:ring-black" required />
          <Input type="password" placeholder="Senha" className="text-sm focus-visible:border-blue-500" required />
          <Button type="submit" className="w-50 h-10 text-lg">
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
};

export { Login1 };
