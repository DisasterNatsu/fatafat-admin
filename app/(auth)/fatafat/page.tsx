"use client";

import Header from "@/components/shared/Header";
import React, { useState } from "react";
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
import { GameIndex } from "@/constants/GameIndex";

const formSchema = z.object({
  gameResultPatti: z
    .string()
    .min(3, { message: "Patti number but be 3 characters" }),
  gameResultNumber: z
    .string()
    .max(1, { message: "It can only be a single digit" }),
});

const Fatafat = () => {
  const [gameIndex, setGameIndex] = useState<string>("");

  // define form element

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameResultPatti: "",
      gameResultNumber: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const formattedDate = DateFormatter();

    if (!gameIndex) {
      return toast({
        title: "Something went wrong",
        description: "Please select a game index",
        variant: "destructive",
      });
    }

    // get token

    try {
      const token = Cookies.get("ff-admin-token");

      if (!token) throw new Error("No token");

      const headers = {
        "ff-admin-token": token,
      };

      const data = {
        date: formattedDate,
        data: {
          gameResultPatti: value.gameResultPatti,
          gameNumber: value.gameResultNumber,
        },
        indexAt: gameIndex,
      };

      const postData = await Axios.post("/post/add-new", data, { headers });

      const response = await postData.data;

      toast({
        title: "Uploaded Successfully",
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
      <Header title="Fatafat" />
      <div className="flex flex-col items-center justify-center">
        <div className="flex justify-center items-center gap-3 container my-10 flex-wrap ">
          {GameIndex.map((item: string, index: number) => (
            <button
              key={item}
              className={`text-sm rounded-md font-semibold px-2 py-1 md:text-2xl md:px-10 uppercase md:py-2 ${
                item === gameIndex ? "bg-green-500 text-black" : "bg-slate-500"
              }`}
              onClick={() => setGameIndex(item)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="gameResultPatti"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patti Result</FormLabel>
                  <FormControl>
                    <Input placeholder="eg: 123" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gameResultNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number Result</FormLabel>
                  <FormControl>
                    <Input placeholder="eg: 1" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-60">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Fatafat;
