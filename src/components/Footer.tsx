export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-sm text-neutral-500 sm:flex-row dark:text-neutral-400">
        <span>&copy; {new Date().getFullYear()} Ali Alnabhan. All rights reserved.</span>
      </div>
    </footer>
  );
}
