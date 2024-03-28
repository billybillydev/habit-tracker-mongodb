export type FormFieldProps = {
  fieldName: string;
  type?: HTMLInputElement["type"];
  value?: string;
  class?: HTMLDivElement["className"];
};

export function FormField({
  fieldName,
  type,
  value,
  class: className,
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
        required
      />
    </div>
  );
}
