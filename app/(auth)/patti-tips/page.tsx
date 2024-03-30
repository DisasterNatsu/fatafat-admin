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
  tips: z.string(),
});

const PattiTips = () => {
  const [gameIndex, setGameIndex] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tips: "",
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

    const formattedDate = DateFormatter();

    try {
      const token = Cookies.get("ff-admin-token");

      const headers = {
        "ff-admin-token": token,
      };

      const data = {
        date: formattedDate,
        tips: {
          tip: inputValue,
        },
        indexAt: gameIndex,
      };

      const postData = await Axios.post("/post/add-patti-tips", data, {
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

  const handleEmojiClick = () => {
    setInputValue(inputValue + " ✅");
  };

  const handleCrossEmojiClick = () => {
    setInputValue(inputValue + " ❌");
  };

  return (
    <div>
      <Header title="Kolkata FF Patti Tips" />
      <div className="container">
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-center items-center gap-3 container my-10 flex-wrap ">
            {GameIndex.map((item: string, index: number) => (
              <button
                key={item}
                className={`text-sm rounded-md font-semibold px-2 py-1 md:text-2xl md:px-10 uppercase md:py-2 ${
                  item === gameIndex
                    ? "bg-green-500 text-black"
                    : "dark:bg-slate-500 bg-slate-950 text-white dark:text-white"
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
                name="tips"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tips</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: 123"
                        {...field}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        required
                      />
                    </FormControl>
                    <p className="text-xs">
                      Spearate the tip numbers by &apos;,&apos; - eg: 1, 2, 3,
                      4, 5
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
          <div className="mt-2 flex space-x-3 md:-mt-10">
            <Button variant={"outline"} onClick={handleEmojiClick}>
              ✅
            </Button>
            <Button variant={"outline"} onClick={handleCrossEmojiClick}>
              ❌
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PattiTips;
