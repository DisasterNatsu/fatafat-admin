"use client";

import { UseAuth } from "@/components/hooks/useAuth";

import Loading from "@/components/shared/Loading";
import { ModeToggle } from "@/components/shared/ModeToggle";
import SideNav from "@/components/shared/SideNav";
import { setUser } from "@/redux/slices/AuthSlice";
import { RootState } from "@/redux/store/store";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Layout = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);

  // initiate router

  const Router = useRouter();

  // get pathName

  const pathName = usePathname();

  // declare dispatch

  const dispatch = useDispatch();

  // get the current nav state

  const open = useSelector((state: RootState) => state.navState.open);

  // check if logged in

  const checkIfLoggedIn = async () => {
    const valid: User = await UseAuth();

    if (valid.authenticated) {
      setLoading(false);

      return dispatch(setUser({ email: valid.email }));
    } else {
      return Router.replace("/");
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, [pathName]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="h-screen fixed">
        <SideNav />
      </div>
      <div
        className={`${
          open ? "ml-72" : "ml-20"
        } duration-300 text-2xl flex-1 h-screen`}
      >
        <ModeToggle />
        {children}
      </div>
    </div>
  );
};

export default Layout;
