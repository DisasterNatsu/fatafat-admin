"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Axios } from "@/utils/Axios";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(5, { message: "Password can't be less than 5 characters" }),
});

const LandingPage = () => {
  // initiate router
  const Router = useRouter();

  // define form from the form schema and react hooks form

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // try catch
console.log(data);
    try {
      const logIn = await Axios.post("/auth/admin/log-in", data);

      const response: LogInResponse = await logIn.data;

      // set auth token if there is any error it will trigger the error boundary

      Cookies.set("ff-admin-token", response.authToken, { expires: 3 });

      // show a toast

      toast({
        title: "Success",
        description: `Welcome back ${response.email}`,
      });

      return setTimeout(() => {
        Router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Something Went Wrong",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };
  // ...

  return (
    <main className="p-4 w-screen h-screen flex flex-col justify-center items-center">
      <meta
        name="google-site-verification"
        content="eCDHq0r6Jf_PnUuw123anZwrRdbrhX4KBp3FJcIkWkY"
      />
      <h1 className="text-2xl font-bold">
        KolkataFF<span className="text-green-500">.</span>space
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg. john@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full font-semibold">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default LandingPage;
