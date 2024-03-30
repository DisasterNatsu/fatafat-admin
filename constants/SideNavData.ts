import { LuLayoutDashboard } from "react-icons/lu";
import {
  MdOutlineLibraryBooks,
  MdAccountBalance,
  MdOutlineBugReport,
  MdSearch,
  MdOutlineSettings,
  MdOutlineTipsAndUpdates,
  MdRepeatOn,
} from "react-icons/md";

export const SideNavData = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: LuLayoutDashboard,
  },
  {
    title: "Fatafat",
    link: "/fatafat",
    icon: MdOutlineLibraryBooks,
  },
  {
    title: "Tips",
    link: "/tips",
    icon: MdAccountBalance,
    gap: true,
  },
  {
    title: "Patti Tips",
    link: "/patti-tips",
    icon: MdOutlineTipsAndUpdates,
  },
  {
    title: "Repeat Tips",
    link: "/repeat-patti",
    icon: MdRepeatOn,
  },
  {
    title: "Generated Tips",
    link: "/generated-tips",
    icon: MdOutlineBugReport,
  },
  {
    title: "Search",
    link: "/search",
    icon: MdSearch,
    gap: true,
  },
  {
    title: "Settings",
    link: "/settings",
    icon: MdOutlineSettings,
  },
];
