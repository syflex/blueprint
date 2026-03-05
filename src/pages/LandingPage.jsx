import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { componentRegistry, componentTypes } from "../registry/componentRegistry";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center px-6 pt-16 pb-20">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#EDEDF0] bg-white px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00B894]" />
          <span className="text-xs text-[#56565C]">Open Source</span>
        </div>
        <h1 className="max-w-2xl text-center font-[Poppins] text-4xl font-light leading-tight text-[#2D2D31] md:text-5xl">
          Visual Appwrite
          <br />
          <span className="font-normal text-[#FD366E]">System Designer</span>
        </h1>
        <p className="mt-4 max-w-lg text-center text-[#56565C]">
          Drag components onto a canvas, connect them, configure your backend,
          and export production-ready TypeScript code in seconds.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            to="/canvas"
            className="rounded-md bg-[#FD366E] px-5 py-2.5 text-sm font-medium text-white no-underline hover:opacity-90"
          >
            Start Designing
          </Link>
          {user ? (
            <Link
              to="/dashboard"
              className="rounded-md border border-[#EDEDF0] bg-white px-5 py-2.5 text-sm text-[#2D2D31] no-underline hover:bg-[#F9F9FA]"
            >
              My Projects
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-md border border-[#EDEDF0] bg-white px-5 py-2.5 text-sm text-[#2D2D31] no-underline hover:bg-[#F9F9FA]"
            >
              Sign In
            </Link>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[#EDEDF0] bg-white px-6 py-16">
        <h2 className="mb-2 text-center font-[Poppins] text-2xl font-light text-[#2D2D31]">
          How it works
        </h2>
        <p className="mb-10 text-center text-sm text-[#97979B]">
          Three steps from idea to code
        </p>
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Drag & Drop",
              desc: "Place Appwrite services onto the visual canvas from the component library.",
            },
            {
              step: "2",
              title: "Connect & Configure",
              desc: "Wire services together and configure collections, buckets, functions, and more.",
            },
            {
              step: "3",
              title: "Export Code",
              desc: "Get production-ready TypeScript with hooks, types, and setup scripts as a ZIP.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex flex-col items-center rounded-lg border border-[#EDEDF0] p-6 text-center"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#FD366E] text-sm font-medium text-white">
                {item.step}
              </div>
              <h3 className="mb-1 text-sm font-medium text-[#2D2D31]">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-[#97979B]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Component cards */}
      <section className="border-t border-[#EDEDF0] px-6 py-16">
        <h2 className="mb-2 text-center font-[Poppins] text-2xl font-light text-[#2D2D31]">
          Supported Services
        </h2>
        <p className="mb-10 text-center text-sm text-[#97979B]">
          All core Appwrite services, ready to drag onto your canvas
        </p>
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {componentTypes.map((type) => {
            const def = componentRegistry[type];
            return (
              <div
                key={type}
                className="flex items-start gap-3 rounded-lg border border-[#EDEDF0] bg-white p-4"
              >
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${def.color}15` }}
                >
                  <span
                    className={`${def.icon} text-base`}
                    style={{ color: def.color }}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#2D2D31]">
                    {def.label}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#97979B]">
                    {def.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#EDEDF0] bg-white px-6 py-16 text-center">
        <h2 className="font-[Poppins] text-2xl font-light text-[#2D2D31]">
          Ready to build?
        </h2>
        <p className="mt-2 text-sm text-[#97979B]">
          No account required to start designing.
        </p>
        <Link
          to="/canvas"
          className="mt-6 inline-block rounded-md bg-[#FD366E] px-6 py-2.5 text-sm font-medium text-white no-underline hover:opacity-90"
        >
          Open Canvas
        </Link>
      </section>
    </main>
  );
}
