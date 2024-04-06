import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  return (
    <main className="relative min-h-screen margin-auto sm:flex sm:items-center sm:justify-center">
      <div className="flex flex-col space-y-4 px-4">
        <div>LINK tags</div>
        <Link
          to="/join"
          className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
        >
          Join
        </Link>
        <Link
          to="/login"
          className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
        >
          Log In
        </Link>
      </div>


      <div className="flex flex-col space-y-4 px-4">
        <div> A TAGS</div>
        <a href="/join" className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8">
          Join
        </a>

        <a href="/login" className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600" >
          Log In
        </a>
      </div>
    </main>
  );
}
