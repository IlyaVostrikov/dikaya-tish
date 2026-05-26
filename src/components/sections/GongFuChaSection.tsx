"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import MicroBreath from "@/components/ui/MicroBreath";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

interface Step {
  num: string;
  title: string;
  chinese: string;
  description: string;
  detail: string;
  stepImage: string;
}

const steps: Step[] = [
  {
    num: "01",
    title: "Подготовка",
    chinese: "准备",
    description: "Прогрев чайника и пиал горячей водой",
    detail:
      "Вода нагревается до нужной температуры. Чайник и пиалы прогреваются — это пробуждает глину, подготавливая её к встрече с чаем. Вся посуда выставляется на чайную доску (чабань).",
    stepImage: "/step1.png",
  },
  {
    num: "02",
    title: "Знакомство",
    chinese: "赏茶",
    description: "Чайные листья помещаются в чайник",
    detail:
      "Сухой лист пересыпается в прогретую гайвань или чайник. Первый вдох аромата от нагретых стенок — вы знакомитесь с чаем ещё до того, как он коснулся воды.",
    stepImage: "/step2.png",
  },
  {
    num: "03",
    title: "Пробуждение",
    chinese: "润茶",
    description: "Быстрое ополаскивание — первый пролив",
    detail:
      "Листья заливаются водой и сразу же сливаются. Это «промывание» очищает лист от пыли и пробуждает его. Аромат раскрывается, лист начинает дышать.",
    stepImage: "/step3.png",
  },
  {
    num: "04",
    title: "Настаивание",
    chinese: "泡茶",
    description: "Короткие проливы по 10–30 секунд",
    detail:
      "Вода заливается и настаивается всего 10–30 секунд. Каждый последующий пролив чуть длиннее предыдущего. Один и тот же чай раскрывается по-новому: первый пролив — лёгкий и цветочный, пятый — глубокий и древесный.",
    stepImage: "/step4.png",
  },
  {
    num: "05",
    title: "Разлив",
    chinese: "斟茶",
    description: "Чай разливается поровну через чахай",
    detail:
      "Настой переливается в чахай (сосуд справедливости), чтобы крепость стала одинаковой для всех. Затем чай разливается по маленьким пиалам — каждому гостю поровну, без иерархии.",
    stepImage: "/step5.png",
  },
  {
    num: "06",
    title: "Тишина",
    chinese: "品茶",
    description: "Три глотка. Внимание к вкусу.",
    detail:
      "Первый глоток — аромат. Второй — вкус. Третий — послевкусие. Чайная церемония — это не спешка. Это пауза. Это умение слушать тишину внутри себя. Дикая природа в маленькой пиале.",
    stepImage: "/step6.png",
  },
];

export default function GongFuChaSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0]);
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 25 });

  return (
    <section
      id="gongfu"
      ref={ref}
      className="relative bg-cream py-32 md:py-40 px-6 md:px-12 watercolor-bg overflow-hidden"
    >
      {/* Lynx accent watermark */}
      <img
        src="/lynx-accent.png"
        alt=""
        aria-hidden="true"
        className="absolute right-0 top-[5%] w-[35%] md:w-[28%] lg:w-[22%] h-auto object-contain pointer-events-none select-none hidden md:block z-0"
        style={{ filter: "saturate(0.3) contrast(0.7) brightness(1.05)", opacity: 0.1, mixBlendMode: "multiply" as React.CSSProperties["mixBlendMode"] }}
      />

      <motion.div style={{ opacity }} className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20 md:mb-32">
          <p className="text-forest/50 text-[11px] tracking-[0.35em] uppercase mb-4 font-medium">
            Способ заваривания
          </p>
          <div className="flex items-baseline gap-4 md:gap-6">
            <h2
              className="text-forest text-3xl md:text-5xl lg:text-6xl font-light tracking-tighter leading-none"
              style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
            >
              Гун Фу Ча
            </h2>
            <span className="text-forest/20 text-lg md:text-2xl font-light">工夫茶</span>
          </div>

          {/* Leaf separator */}
          <div className="mt-8">
            <MicroBreath className="inline-block" delay={0.6}>
              <img
                src="/leaf.svg"
                alt=""
                className="h-5 w-auto text-sage/20"
                aria-hidden="true"
              />
            </MicroBreath>
          </div>

          <p className="text-forest/55 text-sm md:text-base leading-relaxed font-light mt-8 max-w-[48ch]">
            Китайская чайная церемония, в которой главное — не ритуал, а внимание.
            Каждое движение имеет смысл. Каждая секунда настаивания меняет вкус.
          </p>
        </div>

        {/* Two-column layout: steps (left) + teaware illustration (right) */}
        <div className="grid md:grid-cols-[3fr_2fr] gap-16 md:gap-20">
          {/* Steps column */}
          <div className="space-y-0">
            {steps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} />
            ))}
          </div>

          {/* Right column — teaware watercolor */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.5 }}
            className="hidden md:block sticky top-32 self-start"
          >
            <img
              src="/teaware-illustration.png"
              alt=""
              loading="lazy"
              className="w-full h-auto object-contain"
              style={{
                filter: "saturate(0.55) contrast(0.9) brightness(0.95)",
                opacity: 0.85,
              }}
            />
            <p className="text-forest/25 text-[10px] tracking-[0.2em] uppercase mt-6 text-center font-light">
              Искусство чая
            </p>
          </motion.div>

          {/* Mobile: teaware below steps */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="md:hidden flex justify-center mt-12"
          >
            <img
              src="/teaware-square.png"
              alt=""
              loading="lazy"
              className="w-48 h-auto object-contain"
              style={{
                filter: "saturate(0.55) contrast(0.9) brightness(0.95)",
                opacity: 0.75,
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const rawProgress = useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 1, 1]);
  const progress = useSpring(rawProgress, { stiffness: 100, damping: 25 });

  const rawX = useTransform(scrollYProgress, [0, 0.4], [30, 0]);
  const rawO = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const x = useSpring(rawX, { stiffness: 80, damping: 25 });
  const o = useSpring(rawO, { stiffness: 80, damping: 25 });

  return (
    <motion.div
      ref={cardRef}
      style={{ x, opacity: o }}
      className="relative pl-10 md:pl-14 pb-14 md:pb-16 group cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Vertical timeline line */}
      <div className="absolute left-[7px] top-1 bottom-0 w-px bg-forest/08" />

      {/* Connection line from previous step */}
      {index < steps.length - 1 && (
        <motion.div
          className="absolute left-[7px] top-10 w-px bg-sage/30"
          style={{
            height: "calc(100% - 2.5rem)",
            scaleY: progress,
            transformOrigin: "top",
          }}
        />
      )}

      {/* Circle marker */}
      <motion.div
        className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2 border-forest/15 bg-cream"
        style={{
          scale: useTransform(scrollYProgress, [0, 0.2], [0.8, 1]),
          borderColor: useTransform(scrollYProgress, [0, 0.2], ["rgba(31,58,52,0.12)", "rgba(110,140,122,0.35)"]),
        }}
      />

      {/* Hover circle image — appears at timeline dot, top-left */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] as const }}
            className="hidden md:flex absolute -left-[40px] -top-[40px] lg:-left-[44px] lg:-top-[44px] w-[96px] h-[96px] lg:w-[104px] lg:h-[104px] rounded-full overflow-hidden border border-forest/6 pointer-events-none z-10"
            style={{
              boxShadow: "0 2px 24px rgba(31,58,52,0.05)",
            }}
          >
            <img
              src={step.stepImage}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ filter: "saturate(0.55) contrast(0.9) brightness(0.95)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Number */}
      <p className="text-forest/20 text-[10px] tracking-[0.25em] font-medium mb-1 transition-colors duration-500 group-hover:text-sage/40">
        {step.num}
      </p>

      {/* Title + Chinese */}
      <div className="flex items-baseline gap-2 mb-1">
        <h3
          className="text-forest/80 text-lg md:text-xl font-light tracking-[0.04em] transition-colors duration-500 group-hover:text-forest"
          style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
        >
          {step.title}
        </h3>
        <span className="text-forest/25 text-xs font-light">{step.chinese}</span>
      </div>

      {/* Short description */}
      <p className="text-forest/55 text-sm font-light mb-3 transition-colors duration-500 group-hover:text-forest/65">
        {step.description}
      </p>

      {/* Expanding detail */}
      <motion.p
        className="text-forest/65 text-sm leading-relaxed font-light overflow-hidden"
        style={{
          maxHeight: useTransform(scrollYProgress, [0, 0.25, 0.4], [0, 0, 200]),
          opacity: useTransform(scrollYProgress, [0, 0.25, 0.4], [0, 0, 1]),
        }}
      >
        {step.detail}
      </motion.p>
    </motion.div>
  );
}
