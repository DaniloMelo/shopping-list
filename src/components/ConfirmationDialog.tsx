interface ConfirmationDialogProps {
  message: string;
  isOpen: boolean;
  onConfirmation(value: boolean): void;
}

export default function ConfirmationDialog({ message, isOpen, onConfirmation }: ConfirmationDialogProps) {
  return (
    <section
      className={`flex justify-center items-center fixed h-screen w-screen top-0 left-0 bg-zinc-700/50 backdrop-blur-sm z-10 ${isOpen ? "fixed" : "hidden"}`}
      onClick={() => onConfirmation(false)}
    >
      <div
        className="flex flex-col items-center flex-1 max-w-4xl p-8 mx-8 rounded-lg bg-primaryLightBG dark:bg-primaryDarkBG"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-6 text-lightTxt dark:text-darkTxt">{message}</p>

        <div className="flex justify-center items-center gap-x-4">
          <button
            className="py-2 px-4 rounded-lg bg-primaryBtnColor hover:bg-primaryBtnColorHover active:bg-primaryBtnColorHover text-zinc-300"
            onClick={() => onConfirmation(true)}
          >
            Sim
          </button>

          <button
            className="py-2 px-4 rounded-lg bg-secondaryBtnColor hover:bg-secondaryBtnColorHover active:secondaryBtnColorHover text-zinc-300"
            onClick={() => onConfirmation(false)}
          >
            Não
          </button>
        </div>
      </div>
    </section>
  );
}
