export type DividerProps = {
    text: string;
}

export function Divider({ text }: DividerProps) {
  return (
    <section class={"flex items-center gap-x-2"}>
      <span class={"grow bg-white h-0.5"}></span>
      <span>{text}</span>
      <span class={"grow bg-white h-0.5"}></span>
    </section>
  );
}