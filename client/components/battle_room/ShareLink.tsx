// components/ShareLink.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "../ui/card";

export default function ShareLink({ link }: { link: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <Button onClick={handleCopy} variant={"secondary"} className="w-40">
                {copied ? "Copied!" : "🔗 Copy Code"}
            </Button>
        </div>
    );
}
