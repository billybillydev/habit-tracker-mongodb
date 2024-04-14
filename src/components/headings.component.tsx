export function Headings({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <div class="px-4 py-10 flex items-center justify-center">
      <section class="text-center bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text font-extrabold text-transparent">
        {children}
      </section>
    </div>
  );
}

export function Title({ text }: { text: string }) {
  return <h1 class={"text-3xl md:text-5xl"}>{text}</h1>;
}

export function SubTitle({ text }: { text: string }) {
  return <h2 class={"text-xl md:text-3xl"}>{text}</h2>;
}
