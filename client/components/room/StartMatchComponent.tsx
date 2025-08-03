'use client'
import { Button } from "@/components/ui/button"


export default function StartMatchComponent({
    handleStartMatchmaking
}: {
    handleStartMatchmaking: () => void;
}) {
    return (
        <div className="">
            <Button onClick={handleStartMatchmaking}>
                Quick Match
            </Button>
        </div>
    )
}