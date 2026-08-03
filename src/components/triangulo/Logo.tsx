import { motion } from "framer-motion";

const LOGO_SRC = "/logo-triangulo-solutions.jpg";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
}

export function Logo({ variant = "dark", className = "" }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-foreground";
  return (
    <a href="#inicio" className={`group flex items-center gap-2.5 ${className}`}>
      <motion.img
        src={LOGO_SRC}
        alt="Triângulo Solutions"
        className="h-10 w-10 rounded-lg object-cover"
        width={40}
        height={40}
        whileHover={{ rotate: -6, scale: 1.06 }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
      />
      <div className={`leading-none ${textColor}`}>
        <div className="text-[11px] font-light tracking-wide opacity-80 italic">Triângulo</div>
        <div className="text-lg font-bold tracking-tight">Solutions</div>
      </div>
    </a>
  );
}
