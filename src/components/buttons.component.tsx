import clsx from "clsx";

export type ButtonProps = JSX.HtmlButtonTag & Partial<JSX.ElementChildrenAttribute> & {
  text?: string;
  variant?: "solid";
};

export function Button({
  children,
  text,
  class: className,
  ...restProps
}: ButtonProps) {
  const classes = clsx(
    "px-3 py-2 border border-transparent rounded disabled:cursor-not-allowed",
    className
  );
  return (
    <button {...restProps} class={classes}>
      {text ?? children}
    </button>
  );
}

export function PrimaryButton({
  children,
  text,
  class: className,
  ...restProps
}: ButtonProps) {
  return (
    <Button
      text={text}
      children={children}
      class={clsx(
        "border-white hover:bg-white hover:text-zinc-900",
        className
      )}
      {...restProps}
    />
  );
}

export function SecondaryButton({ children, text, ...restProps }: ButtonProps) {
  return (
    <Button
      text={text}
      children={children}
      class={"hover:border-white"}
      {...restProps}
    />
  );
}

export function SuccessButton({
  children,
  text,
  variant,
  ...restProps
}: ButtonProps) {
  return (
    <Button
      text={text}
      children={children}
      class={
        variant
          ? "text-green-600 hover:bg-green-600 hover:text-white"
          : "hover:text-green-600"
      }
      variant={variant}
      {...restProps}
    />
  );
}

export function DangerButton({
  children,
  text,
  variant,
  class: className,
  ...restProps
}: ButtonProps) {
  return (
    <Button
      text={text}
      children={children}
      class={clsx(
        variant
          ? "text-red-600 hover:bg-red-600 hover:text-white"
          : "hover:text-red-600",
        className
      )}
      {...restProps}
    />
  );
}

export function InfoButton({
  children,
  text,
  variant,
  ...restProps
}: ButtonProps) {
  return (
    <Button
      text={text}
      children={children}
      class={
        variant
          ? "text-sky-600 hover:bg-sky-600 hover:text-white"
          : "hover:text-sky-600"
      }
      {...restProps}
    />
  );
}
