import { SignInButton as ClerkSignInButton } from "@clerk/nextjs";

export default function SignInButton() {
  return (
    <ClerkSignInButton mode="modal">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Iniciar Sesión
      </button>
    </ClerkSignInButton>
  );
} 