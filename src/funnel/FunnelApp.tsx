import { Router } from "./router";
import Landing from "./pages/Landing";
import Apply from "./pages/Apply";
import Qualified from "./pages/Qualified";
import Book from "./pages/Book";
import NotFit from "./pages/NotFit";

export default function FunnelApp() {
  return (
    <Router
      routes={{
        "/": Landing,
        "/apply": Apply,
        "/qualified": Qualified,
        "/book": Book,
        "/not-a-fit": NotFit,
      }}
    />
  );
}
