export type FormFieldProps = JSX.HtmlInputTag & {
  fieldName: string;
};

export function FormField({
  fieldName,
  type,
  value,
  class: className,
  ...rest
}: FormFieldProps) {
  const classes = [
    "flex gap-x-3 items-center justify-center p-2",
    className,
  ].join(" ");
  return (
    <div class={classes}>
      <label class={"capitalize"} for={fieldName}>
        {fieldName}
      </label>
      <input
        class={"grow rounded-md bg-neutral-800"}
        name={fieldName}
        id={fieldName}
        type={type || "text"}
        value={value || ""}
        required="true"
        {...rest}
      />
    </div>
  );
}
