"use client";

import { Axios } from "@/utils/Axios";
import Cookies from "js-cookie";

export const UseAuth = async () => {
  // get token from cookies

  const token = Cookies.get("ff-admin-token");

  if (!token) return { verified: false };

  // the header of the request

  const headers = {
    "ff-admin-token": token,
  };

  try {
    const isAuth = await Axios.get("/auth/admin/is-auth", { headers });

    const data = await isAuth.data;

    return data;
  } catch (error) {
    console.log(error);

    return { verified: false };
  }
};
