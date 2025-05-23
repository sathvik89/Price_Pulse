"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/dashboard")}
      className="flex items-center text-gray-300 hover:text-white transition-colors"
    >
      <ArrowLeft className="mr-1" size={20} />
      <span>back</span>
    </button>
  );
};

export default BackButton;
