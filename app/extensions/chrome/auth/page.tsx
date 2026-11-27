import type { Metadata } from "next";
import { ExtensionAuthClient } from "./extension-auth-client";

export const metadata: Metadata = {
  title: "Connect Extension",
  robots: { index: false, follow: false },
};

export default function ExtensionAuthPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Connect Chrome extension
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in with Google to link your Instarchiver extension.
      </p>
      <ExtensionAuthClient />
    </div>
  );
}
