
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

const Counter = ({
    label,
    decrement,
    increment,
    value,
}: {
    label: string
    min: number
    max: number
    step?: number
    decrement: () => void
    increment: () => void
    value: number
}) => {

    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">{label}</span>
            <div className="flex items-center gap-3 p-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={decrement}
                    className="text-center rounded-full text-xl font-bold border border-neutral-700"
                >
                    <Minus className="rotate-180" />
                </Button>
                <span className="w-12 text-center text-lg font-bold text-white">{value}</span>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={increment}
                    className="text-center rounded-full text-xl font-bold border border-neutral-700"
                >
                    <Plus className="rotate-180" />
                </Button>
            </div>
        </div>

    )
}

export default Counter;