import { BaseHtml, HTMLProps } from "./base-html.component";

export function RootLayout({ children, title, class: className, isHTMX }: HTMLProps) {
    return (
      <BaseHtml title={title} class={className} isHTMX={isHTMX}>
        <main class={"w-full h-full"}>{children}</main>
      </BaseHtml>
    );
}