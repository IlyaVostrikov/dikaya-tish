"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { getLocalImage } from "@/lib/images";

interface Stage {
  name: string;
  chinese: string;
  oxidation: number;
  process: string;
  description: string;
  color: string;
  imageQuery: string;
}

const stages: Stage[] = [
  {
    name: "Зелёный чай",
    chinese: "绿茶",
    oxidation: 0,
    process: "Ша цин (杀青): фиксация паром или прожаркой",
    description:
      "Сразу после сбора лист нагревают до 200–280°C. Фермент полифенолоксидаза разрушается мгновенно, окисление невозможно. Цвет остаётся зелёным, вкус: свежий, травянистый, с нотами весенней зелени. Минимальное вмешательство человека, максимальная живость природы.",
    color: "#6E8C7A",
    imageQuery: "green tea processing china",
  },
  {
    name: "Белый чай",
    chinese: "白茶",
    oxidation: 8,
    process: "Вэй дяо (萎凋): естественное вяление 48–72 часа",
    description:
      "Только почки и молодые листья. Никакой фиксации и скручивания, только вяление на солнце и в тени. За 2–3 суток медленного увядания происходит лёгкое естественное окисление (5–10%). Результат: природная сладость, цветочный аромат и серебристый пушок на почках.",
    color: "#8A9B8A",
    imageQuery: "white tea buds withering",
  },
  {
    name: "Жёлтый чай",
    chinese: "黄茶",
    oxidation: 15,
    process: "Мэнь хуан (闷黄): закрытое томление",
    description:
      "После фиксации лист заворачивают во влажную ткань и оставляют на 2–3 суток в закрытых ёмкостях. В условиях тепла и влажности происходит мягкое неферментативное потемнение, или «томление». Окисление 10–20%. Технология известна лишь немногим мастерам, объёмы производства крайне малы.",
    color: "#B7C5BD",
    imageQuery: "yellow tea china",
  },
  {
    name: "Улун",
    chinese: "乌龙茶",
    oxidation: 50,
    process: "Цзо цин (做青): встряхивание и частичное окисление",
    description:
      "Лист встряхивают в бамбуковых корзинах, повреждая края. Сок выступает на поверхность и окисляется на воздухе. Процесс повторяют 5–12 раз в течение нескольких часов. Окисление 15–80% в зависимости от стиля. Каждый процент меняет характер чая: от цветочного к фруктовому и ореховому.",
    color: "#C4A35A",
    imageQuery: "oolong tea rolling processing",
  },
  {
    name: "Красный чай",
    chinese: "红茶",
    oxidation: 90,
    process: "Фа цзяо (发酵): полная ферментация",
    description:
      "Лист скручивают и оставляют в тёплом влажном помещении на 4–8 часов. Полифенолы окисляются на 80–95%, образуя теафлавины и теарубигины. Лист становится медно-красным, вкус: глубокий, согревающий, с нотами сухофруктов, мёда и ягод. То, что в Европе называют чёрным чаем.",
    color: "#8B5E3C",
    imageQuery: "black tea processing fermentation",
  },
  {
    name: "Пуэр",
    chinese: "普洱茶",
    oxidation: 100,
    process: "Во дуй (渥堆): влажное скирдование + выдержка",
    description:
      "Шу пуэр: лист смачивают и складывают в кучи высотой 1–1,5 м под тентом. Микроорганизмы (Aspergillus, Penicillium) запускают глубинную пост-ферментацию при 50–60°C в течение 45–60 дней. Шэн пуэр: естественная выдержка годами. Чай живёт, дышит, меняется десятилетиями, землистый, древесный, бесконечно сложный.",
    color: "#5C4A3A",
    imageQuery: "puerh tea fermentation pile",
  },
];

function StageImage({ query }: { query: string }) {
  const [loaded, setLoaded] = useState(false);
  const src = getLocalImage(query);
  if (!src) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      className="aspect-[16/9] mb-8 overflow-hidden bg-mist/10"
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover watercolor-img"
        onLoad={() => setLoaded(true)}
      />
    </motion.div>
  );
}

export default function FermentationPath() {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 25 });

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] bg-cream flex items-center py-32 md:py-40 px-6 md:px-12 overflow-hidden"
    >
      <motion.div style={{ opacity }} className="max-w-[1400px] mx-auto w-full">
        <p className="text-forest/50 text-[11px] tracking-[0.35em] uppercase mb-6 font-medium">
          Путь чайного листа
        </p>
        <h2
          className="text-forest text-3xl md:text-5xl lg:text-6xl font-light tracking-tighter leading-none mb-24 max-w-[18ch]"
          style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
        >
          От свежести до глубины
        </h2>

        {/* Timeline — horizontal on desktop, vertical on mobile */}
        <div className="relative mb-24">
          {/* Desktop: horizontal line + circles */}
          <div className="hidden md:block">
            <div className="absolute top-[19px] left-[8%] right-[8%] h-px bg-forest/10" />
            <div className="relative flex justify-between items-start">
              {stages.map((stage, i) => {
                const active = activeStage === i;
                const progress = stage.oxidation / 100;
                return (
                  <div key={stage.name} className="relative flex flex-col items-center" style={{ width: "16.66%" }}>
                    <div className="relative">
                      <svg width="48" height="48" viewBox="0 0 48 48" className="absolute -top-[14px] -left-[14px]">
                        <circle
                          cx="24" cy="24" r="19"
                          fill="none"
                          stroke="rgba(31,58,52,0.05)"
                          strokeWidth="1.2"
                        />
                        {active && (
                          <motion.circle
                            cx="24" cy="24" r="19"
                            fill="none"
                            stroke={stage.color}
                            strokeWidth="2"
                            strokeDasharray={`${2 * Math.PI * 19 * progress} ${2 * Math.PI * 19 * (1 - progress)}`}
                            strokeDashoffset={2 * Math.PI * 19 * 0.25}
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: progress, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                          />
                        )}
                        {active && (
                          <motion.circle
                            cx="24" cy="24" r="19"
                            fill="none"
                            stroke={stage.color}
                            strokeWidth="1.5"
                            initial={{ opacity: 0.6, r: 19 }}
                            animate={{ opacity: 0, r: 30 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                          />
                        )}
                      </svg>
                      <motion.button
                        onClick={() => setActiveStage(active ? null : i)}
                        aria-label={`${stage.name}: ${stage.oxidation}% окисление`}
                        aria-expanded={active}
                        className={`relative z-10 w-11 h-11 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                          active ? "shadow-lg" : ""
                        }`}
                        style={{
                          backgroundColor: active ? stage.color : "var(--color-cream)",
                          borderColor: active ? stage.color : "rgba(31,58,52,0.15)",
                        }}
                        whileHover={{
                          scale: 1.3,
                          boxShadow: `0 0 16px ${stage.color}40`,
                        }}
                        whileTap={{ scale: 0.85 }}
                      >
                        <span
                          className="w-[14px] h-[14px] rounded-full"
                          style={{ backgroundColor: active ? "rgba(255,255,255,0.3)" : "rgba(31,58,52,0.12)" }}
                        />
                      </motion.button>
                    </div>

                    <span
                      className="mt-5 text-xs tracking-[0.12em] whitespace-nowrap transition-all duration-500 font-medium"
                      style={{ color: active ? stage.color : "rgba(31,58,52,0.55)" }}
                    >
                      {stage.name}
                    </span>

                    <span className={`text-xs mt-1 font-medium transition-colors duration-500 ${
                      active ? "text-forest/70" : "text-forest/45"
                    }`}>
                      {stage.oxidation}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: vertical timeline with connecting bar */}
          <div className="md:hidden space-y-0">
            {stages.map((stage, i) => {
              const active = activeStage === i;
              return (
                <div key={stage.name} className="flex items-center gap-4 py-2.5">
                  <motion.button
                    onClick={() => setActiveStage(active ? null : i)}
                    aria-label={`${stage.name}: ${stage.oxidation}% окисление`}
                    className={`relative z-10 w-12 h-12 min-w-[48px] rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                      active ? "shadow-lg" : ""
                    }`}
                    style={{
                      backgroundColor: active ? stage.color : "var(--color-cream)",
                      borderColor: active ? stage.color : "rgba(31,58,52,0.15)",
                    }}
                    whileTap={{ scale: 0.85 }}
                  >
                    <span
                      className="w-[12px] h-[12px] rounded-full"
                      style={{ backgroundColor: active ? "rgba(255,255,255,0.3)" : "rgba(31,58,52,0.12)" }}
                    />
                  </motion.button>

                  {/* Oxidation bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <span
                        className="text-sm tracking-[0.08em] font-medium"
                        style={{ color: active ? stage.color : "rgba(31,58,52,0.65)" }}
                      >
                        {stage.name}
                      </span>
                      <span className="text-xs font-medium text-forest/45">{stage.oxidation}%</span>
                    </div>
                    <div className="h-[2px] bg-forest/06 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${stage.oxidation}%`,
                          backgroundColor: stage.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail card */}
        <AnimatePresence mode="wait">
          {activeStage !== null && (
            <motion.div
              key={stages[activeStage].name}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }}
              className="max-w-2xl"
            >
              <div className="relative border border-forest/10 bg-white watercolor-wash overflow-hidden">
                {/* Photo of processing */}
                <StageImage query={stages[activeStage].imageQuery} />

                <div className="p-10">
                  {/* Colored top bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ backgroundColor: stages[activeStage].color }}
                  />

                  {/* Title + Chinese name */}
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3
                      className="text-2xl md:text-3xl font-light tracking-[0.04em]"
                      style={{
                        color: stages[activeStage].color,
                        fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif",
                      }}
                    >
                      {stages[activeStage].name}
                    </h3>
                    <span className="text-forest/25 text-sm font-light">
                      {stages[activeStage].chinese}
                    </span>
                  </div>

                  {/* Process method */}
                  <p className="text-forest/55 text-xs font-medium tracking-[0.04em] mb-6">
                    {stages[activeStage].process}
                  </p>

                  {/* Oxidation bar */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-forest/45 text-[11px] tracking-[0.12em] uppercase font-medium whitespace-nowrap">
                      Окисление
                    </span>
                    <div className="flex-1 h-[3px] bg-forest/06 max-w-[160px] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${stages[activeStage].oxidation}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        style={{ backgroundColor: stages[activeStage].color }}
                      />
                    </div>
                    <span className="text-forest/60 text-sm font-medium">
                      {stages[activeStage].oxidation}%
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-forest/70 text-base leading-relaxed font-light">
                    {stages[activeStage].description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeStage === null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-forest/45 text-sm mt-16 tracking-[0.1em] font-light"
          >
            Выберите этап на шкале, чтобы узнать детали
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
