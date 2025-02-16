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
  date: z.string(),
  patti: z.string().min(3).max(3, "Must be 3 numbers"),
  digit: z.string().max(1),
});

const PattiTips = () => {
  const [gameIndex, setGameIndex] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      patti: "",
      digit: "",
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
      // Parse patti and digit to numbers
      const pattiNumber = parseInt(value.patti.toString(), 10);
      const digitNumber = parseInt(value.digit.toString(), 10);

      // Check if patti and digit are valid numbers
      if (isNaN(pattiNumber) || isNaN(digitNumber)) {
        return toast({
          title: "Invalid input",
          description: "Please enter valid numbers for patti and digit.",
          variant: "destructive",
        });
      }

      const token = Cookies.get("ff-admin-token");

      const headers = {
        "ff-admin-token": token,
      };

      const data = {
        date: value.date,
        data: {
          gameResultPatti: pattiNumber,
          gameNumber: digitNumber,
        },
        indexAt: gameIndex,
      };

      const postData = await Axios.post("/post/add-new", data, { headers });

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
              className="w-2/3 space-y-5"
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input placeholder="eg: DD-MM-YYYY" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GamePatti */}

              <FormField
                control={form.control}
                name="patti"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patti</FormLabel>
                    <FormControl>
                      <Input placeholder="eg: 123" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Digit */}

              <FormField
                control={form.control}
                name="digit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Digit</FormLabel>
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
    </div>
  );
};

export default PattiTips;
