import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <div className="flex items-center">
        <span className="text-lg sm:text-xl font-bold text-gray-600">Legal</span>
        <span className="text-lg sm:text-xl font-bold text-blue-600">India.ai</span>
      </div>
    </Link>
  );
}
