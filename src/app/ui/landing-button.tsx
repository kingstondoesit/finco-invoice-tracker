import Link from "next/link";

// Landing Page Button Components
type ButtonProps = {
  href: string;
  label: string;
  icon?: React.ReactNode;
  hidden?: boolean;
};

export default function LandingButton({href, label, icon, hidden}: ButtonProps) {

  if (hidden) {
    return null;
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-2 sm:gap-4 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
    >
      <span>{label}</span>
      {icon}
    </Link>
  );
}