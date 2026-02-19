import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import SkillCards from "../components/SkillCards";

export default function About() {
  return (
    <section className="container-page py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-12"
      >
        {/* Bio */}
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            About
          </h1>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            <p>
              Hi, I&apos;m Ali Alnabhan &mdash; a software engineer who enjoys building practical,
              well-crafted tools for the web. I work across the stack but gravitate toward
              frontend engineering, full-stack applications, and developer experience.
            </p>
            <p>
              I&apos;ve built everything from student deadline trackers to social media platforms
              and gaming catalogs. I believe in shipping early, iterating fast, and documenting
              the process along the way.
            </p>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
            Skills &amp; Tools
          </h2>
          <SkillCards />
        </div>

        {/* Education */}
        <div className="max-w-2xl">
          <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
            Education
          </h2>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              BSc Computer Science
            </h3>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Middlesex University &bull; 2024 &ndash; Expected 2027
            </p>
          </div>
        </div>

        {/* CV link */}
        <div>
          <a
            href={import.meta.env.BASE_URL + "Ali-Alnabhan-CV.pdf"}
            download="Ali-Alnabhan-CV.pdf"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5
                       text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:border-primary-300
                       hover:text-primary-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300
                       dark:hover:border-primary-600 dark:hover:text-primary-400"
          >
            <FileText size={16} />
            Download CV
          </a>
        </div>
      </motion.div>
    </section>
  );
}
