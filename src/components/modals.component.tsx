import { EditHabitForm, EditHabitProps } from "$components/habits.component";

export type ModalProps = { children: JSX.Element | JSX.Element[]; ref: string };

export function Modal({ children, ref }: ModalProps) {
  return (
    <div
      class="fixed w-screen h-screen flex items-center justify-center p-2"
      x-data={`modal("${ref}")`}
      x-ref={ref}
      x-bind={`removerEscape`}
    >
      <div
        class={"w-full h-full bg-white/50 absolute"}
        x-bind={`removerClick`}
      />
      <div
        class={"relative [&>*]:bg-zinc-900 text-white w-full md:w-3/4 xl:w-2/3"}
      >
        <button
          class={
            "px-3 py-1 rounded-full bg-inherit absolute border -right-3 -top-3"
          }
          x-bind={`removerClick`}
        >
          x
        </button>
        {children}
      </div>
    </div>
  );
}

export function EditHabitModal(props: Omit<EditHabitProps, "modalRef">) {
  const modalRef = "edit-habit-modal";
  const formProps = { ...props, modalRef };
  return (
    <Modal ref={modalRef}>
      <EditHabitForm {...formProps} />
    </Modal>
  );
}
