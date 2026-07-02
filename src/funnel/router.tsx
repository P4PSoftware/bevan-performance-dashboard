import React, { createContext, useContext, useEffect, useState } from "react";
import { initPixel, trackPageView } from "./tracking";

type RouterCtx = {
  path: string;
  navigate: (to: string) => void;
};

const Ctx = createContext<RouterCtx>({ path: "/", navigate: () => {} });

// eslint-disable-next-line react-refresh/only-export-components
export function useRouter() {
  return useContext(Ctx);
}

export function Router({
  routes,
}: {
  routes: Record<string, React.ComponentType>;
}) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    initPixel();
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView();
  }, [path]);

  const navigate = (to: string) => {
    const [pathname] = to.split("?");
    window.history.pushState({}, "", to);
    setPath(pathname);
  };

  const Page = routes[path] ?? routes["/"];

  return (
    <Ctx.Provider value={{ path, navigate }}>
      <Page />
    </Ctx.Provider>
  );
}

/** Anchor that uses client-side navigation for internal links. */
export function Link({
  to,
  className,
  children,
  onClick,
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
