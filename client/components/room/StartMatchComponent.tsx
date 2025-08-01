'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSession } from "@/store/features/account/AccountSlice";
import { RootState } from "@/store";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TemporaryUser } from "@/types";

const FormSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
});

type FormData = z.infer<typeof FormSchema>;

export default function StartMatchComponent({
    handleStartMatchmaking
}: {
    handleStartMatchmaking: () => void;
}) {
    const dispatch = useDispatch();
    const [localData, setLocalData] = useLocalStorage<TemporaryUser>("username", {
        id: Math.floor(1000 + Math.random() * 9000),
        username: "",
        avatar: "",
    });
    const session = useSelector((Root: RootState) => Root.AccountState.session)
    const [mounted, setMounted] = useState(false);

    const { handleSubmit, setValue, register, formState: { errors } } = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: session?.username || "",
        },
    });

    const onSubmit = async (data: FormData) => {
        const id = localData.id ?? Math.floor(1000 + Math.random() * 9000);
        setLocalData({
            id: id,
            username: data.username,
            avatar: "", // Placeholder for avatar, can be updated later
        });
        dispatch(setSession({
            id: id,
            username: data.username,
            email: "email@example.com",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as any))
        handleStartMatchmaking();
    };

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        }
    }, []);

    if (!mounted) {
        return <div className="h-[100dvh] w-full flex justify-center items-center">
            <span className="text-muted-foreground">Loading...</span>
        </div>
    }

    return (
        <div className="h-[100dvh] p-1 flex justify-center items-center w-full">
            <Card className="md:w-96 md:h-auto w-full h-full pt-16 md:pt-0 rounded-3xl">
                <CardHeader className="space-y-1">

                    <CardTitle className="text-2xl">
                        Quiz Battle - {localData.username || "Set Username"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your username to start playing
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" type="text" placeholder="Enter your username" {...register("username", { required: true })} />
                        <div className="h-4 w-full text-center mb-2">
                            {errors.username ? <span className="text-red-500">{errors.username?.message}</span> : <></>}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        className="w-full">
                        Start Match
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}