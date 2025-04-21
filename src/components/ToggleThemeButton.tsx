import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";

import useTheme from "@/hooks/useTheme";

export default function ToggleThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="rounded-full gap-x-2 overflow-hidden" onClick={toggleTheme}>
      {theme === "light" ? (
        <div className="flex justify-center items-center h-10 w-10 p-1 bg-blue-600 rounded-full">
          <MdLightMode className="text-yellow-300 text-2xl" />
        </div>
      ) : (
        <div className="flex justify-center items-center h-10 w-10 p-1 bg-blue-950 rounded-full">
          <MdDarkMode className="text-white text-2xl" />
        </div>
      )}
    </div>
  );
}
