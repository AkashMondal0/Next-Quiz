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
import { useDispatch } from "react-redux";
import { setSession } from "@/store/features/account/AccountSlice";

const FormSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
});

type FormData = z.infer<typeof FormSchema>;

export default function LoginComponent() {
  const dispatch = useDispatch();

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    dispatch(setSession({
      id: Math.floor(1000 + Math.random() * 9000),
      username: data.username,
      email: "email@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any))
  };

  return (
    <div className="h-[100dvh] p-1 flex justify-center items-center w-full">
      <Card className="md:w-96 md:h-auto w-full h-full pt-16 md:pt-0 rounded-3xl">
        <CardHeader className="space-y-1">

          <CardTitle className="text-2xl">
            Next Quiz
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
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}