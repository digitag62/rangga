import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Link href="/sign-in" className={buttonVariants({ variant: "outline" })}>
        Get Started
      </Link>
    </div>
  );
}
