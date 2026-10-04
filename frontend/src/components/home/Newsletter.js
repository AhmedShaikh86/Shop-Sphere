"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToastStore } from "@/store/toastStore";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const showToast = useToastStore((state) => state.showToast);

  function handleSubmit(event) {
    event.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    showToast("Thanks for subscribing — new arrivals land in your inbox first.");
    setEmail("");
  }

  return (
    <section className="border-t border-border bg-foreground py-16 text-background">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl sm:text-3xl">Join the List</h2>
        <p className="mt-3 text-sm text-background/80">
          Be first to know about new arrivals, restocks and considered edits.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className="bg-background/5 text-background placeholder:text-background/50"
          />
          <Button type="submit" variant="accent" className="sm:w-40">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
