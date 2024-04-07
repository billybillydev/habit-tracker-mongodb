export type RadioProps<T> = Omit<JSX.HtmlInputTag, "placeholder"> & T & { text?: string };
export function RadioInput({
  id,
  class: className,
  children,
  limit,
  text,
  ...restProps
}: RadioProps<{ limit?: number; }>) {
  return (
    <div class="flex">
      <input type="radio" id={id} class="hidden peer" {...restProps} />
      <label for={id} class={className}>
        {text ?? children}
      </label>
    </div>
  );
}
