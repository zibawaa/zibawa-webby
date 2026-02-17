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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container-page py-16 text-center sm:py-24"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
        {/* Cat Avatar */}
        <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-primary-400 shadow-lg shadow-primary-200 dark:shadow-primary-900/40">
          <img
            src={import.meta.env.BASE_URL + "avatar.png"}
            alt="Ali Alnabhan"
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ali Alnabhan
          </h1>
          <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
            Software engineer building useful things on the web. Sharing projects, process, and progress.
          </p>
        </div>

        {/* Social links */}
        <div className="flex gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200
                         text-neutral-500 transition-colors hover:border-primary-300 hover:text-primary-600
                         dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-primary-600 dark:hover:text-primary-400"
            >
              <s.icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
