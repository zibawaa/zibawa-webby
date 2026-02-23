import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const socials = [
  { icon: Github, href: "https://github.com/zibawaa", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/ali-alnabhan22/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@zibawa.dev", label: "Email" },
] as const;

export default function ProfileHeader() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden"
    >
      {/* Gradient mesh background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(217,154,106,0.25),transparent)]
                         dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(217,154,106,0.12),transparent)]" />

      <div className="container-page py-20 sm:py-28">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          {/* Left: Avatar + name block */}
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-start lg:text-left">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="relative shrink-0"
            >
              <div className="h-32 w-32 overflow-hidden rounded-2xl border-4 border-primary-300/80 shadow-xl
                            shadow-primary-900/20 ring-4 ring-primary-100/50 dark:border-primary-600/60
                            dark:ring-primary-950/50 sm:h-40 sm:w-40">
                <img
                  src={import.meta.env.BASE_URL + "avatar.png"}
                  alt="Ali Alnabhan"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Maine Coon paw accent */}
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-accent-500/90
                            dark:bg-accent-400/80" aria-hidden />
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Ali Alnabhan
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                Software engineer building useful things on the web. Sharing projects, process, and progress.
              </p>

              {/* Social links */}
              <div className="flex justify-center gap-3 pt-2 lg:justify-start">
                {socials.map((s, i) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200
                               text-neutral-500 transition-all hover:border-primary-400 hover:text-primary-600
                               dark:border-neutral-700 dark:text-neutral-400
                               dark:hover:border-primary-500 dark:hover:text-primary-400"
                  >
                    <s.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Dev terminal-style card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="hidden w-full max-w-xs shrink-0 lg:block electric-border rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 font-mono text-sm shadow-lg dark:border-neutral-700 dark:bg-neutral-900/80"
          >
            <div className="mb-3 flex gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
              <p><span className="text-accent-600 dark:text-accent-400">$</span> whoami</p>
              <p className="text-neutral-900 dark:text-neutral-100">developer · builder</p>
              <p className="pt-2"><span className="text-accent-600 dark:text-accent-400">$</span> _</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
