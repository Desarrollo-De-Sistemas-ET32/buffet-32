import { UserButton as ClerkUserButton } from "@clerk/nextjs";

export default function UserButton() {
  return (
    <ClerkUserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: "h-10 w-10",
        },
      }}
    />
  );
} 