"use client";

import Header from "@/components/shared/Header";
import { TenGameIndex } from "@/constants/GameIndex";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { DateFormatter } from "@/components/helpers/DateFormatter";
import { Axios } from "@/utils/Axios";

const formSchema = z.object({
  patti: z.string(),
});

const RepeatPatti = () => {
  const [gameIndex, setGameIndex] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patti: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    if (!gameIndex) {
      return toast({
        title: "Something went wrong",
        description: "Please select a game index",
        variant: "destructive",
      });
    }

    try {
      const token = Cookies.get("ff-admin-token");

      if (!token) throw new Error("No token");

      const headers = {
        "ff-admin-token": token,
      };

      const data = {
        repeatPattiData: {
          patti: value.patti,
        },
        indexAt: gameIndex,
      };

      const postData = await Axios.post("/post/repeat-patti", data, {
        headers,
      });

      const response = await postData.data;

      toast({
        title: "Tips updated successfully",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(response, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Something went wrong",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Header title="Kolkata FF Repeat Patti" />
      <div className="container">
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-center items-center gap-3 container my-10 flex-wrap">
            {TenGameIndex.map((item: string, index: number) => (
              <button
                key={item}
                className={`text-sm rounded-md font-semibold px-2 py-1 md:text-2xl md:px-10 uppercase md:py-2 ${
                  item === gameIndex
                    ? "bg-green-500 text-black"
                    : "dark:bg-slate-500 bg-slate-950 text-white dark:text-white"
                }`}
                onClick={() => setGameIndex(item)}
              >
                {index}
              </button>
            ))}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="patti"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repeat Patti</FormLabel>
                      <FormControl>
                        <Input placeholder="eg: 123" {...field} required />
                      </FormControl>
                      <p className="text-xs">
                        Spearate the repeat patti numbers by &apos;,&apos; - eg:
                        1, 2, 3, 4, 5
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit" className="w-full md:w-60">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepeatPatti;
