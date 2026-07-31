import { motion } from "framer-motion";
import { Activity, Workflow, Database, Cog, Gauge, BarChart3 } from "lucide-react";
const LOGO_SRC = "/logo-triangulo-solutions.jpg";

const FLOATING = [
  { label: "Processos", icon: Workflow, x: "-8%", y: "8%", delay: 0, dx: 4, dy: -10 },
  { label: "Dados", icon: Database, x: "78%", y: "0%", delay: 0.35, dx: -5, dy: 8 },
  { label: "Automação", icon: Cog, x: "82%", y: "62%", delay: 0.55, dx: 6, dy: -7 },
  { label: "Gestão", icon: BarChart3, x: "-6%", y: "60%", delay: 0.75, dx: -4, dy: 9 },
  { label: "Produtividade", icon: Gauge, x: "38%", y: "92%", delay: 0.95, dx: 5, dy: -6 },
];

export function HeroVisual() {
  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto">
      {/* Background canvas */}
      <div className="absolute inset-4 rounded-[2rem] bg-graphite overflow-hidden bg-grid-dark">
        {/* Glow blobs */}
        <motion.div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/40 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.55, 0.8, 0.55] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-primary/15 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* SVG geometry */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Triangles */}
          <motion.path
            d="M50 350 L200 80 L350 350 Z"
            stroke="white"
            strokeOpacity="0.18"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
          <motion.path
            d="M120 320 L200 160 L280 320 Z"
            stroke="white"
            strokeOpacity="0.12"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: "easeInOut", delay: 0.4 }}
          />
          {/* Connection lines */}
          {[
            "M60 90 L200 200",
            "M340 80 L200 200",
            "M340 320 L200 200",
            "M60 320 L200 200",
            "M200 380 L200 200",
          ].map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="url(#lineGrad)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.6 + i * 0.15, ease: "easeOut" }}
            />
          ))}
          {/* Pulsing nodes */}
          {[
            { cx: 60, cy: 90 },
            { cx: 340, cy: 80 },
            { cx: 340, cy: 320 },
            { cx: 60, cy: 320 },
            { cx: 200, cy: 380 },
          ].map((p, i) => (
            <g key={i}>
              <motion.circle
                cx={p.cx}
                cy={p.cy}
                r="6"
                fill="oklch(0.58 0.205 25)"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                style={{ transformOrigin: `${p.cx}px ${p.cy}px` }}
              />
            </g>
          ))}
        </svg>

        {/* Central logo with glow */}
        <motion.div
          className="absolute inset-0 grid place-items-center"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 rounded-2xl bg-primary/60 blur-2xl scale-110" />
            <img
              src={LOGO_SRC}
              alt=""
              width={96}
              height={96}
              fetchPriority="high"
              decoding="async"
              className="relative h-24 w-24 rounded-2xl shadow-brand"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating cards (process flow) */}
      {FLOATING.map((f, i) => (
        <motion.div
          key={f.label}
          className="absolute"
          style={{ left: f.x, top: f.y }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 + f.delay, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ y: [0, f.dy, 0], x: [0, f.dx, 0] }}
            transition={{
              duration: 5 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.25,
            }}
            whileHover={{ scale: 1.08, y: -4, transition: { type: "spring", stiffness: 320, damping: 18 } }}
            className="rounded-xl bg-white/95 backdrop-blur border border-border px-3 py-2 shadow-elegant hover:shadow-brand hover:border-primary/40 flex items-center gap-2 cursor-default transition-shadow"
          >
            <div className="h-7 w-7 rounded-md bg-primary/10 grid place-items-center text-primary">
              <f.icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-semibold text-foreground whitespace-nowrap">{f.label}</span>
          </motion.div>
        </motion.div>
      ))}

      {/* KPI bubble */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 1.4 }}
        className="absolute top-1/2 -right-2 -translate-y-1/2 rounded-xl bg-primary text-primary-foreground px-3 py-2.5 shadow-brand"
      >
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <div className="leading-tight">
            <div className="text-[10px] opacity-90">Eficiência</div>
            <div className="text-xs font-bold">+38%</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
