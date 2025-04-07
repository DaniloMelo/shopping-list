interface ConfirmationDialogProps {
  message: string;
  isOpen: boolean;
  onConfirmation(value: boolean): void;
}

export default function ConfirmationDialog({ message, isOpen, onConfirmation }: ConfirmationDialogProps) {
  return (
    <section
      className={`flex justify-center items-center fixed h-screen w-screen top-0 left-0 bg-zinc-700/50 backdrop-blur-sm z-10 ${isOpen ? "fixed" : "hidden"}`}
    >
      <div className="flex flex-col items-center flex-1 max-w-4xl p-8 mx-8 bg-black rounded-lg">
        <p className="mb-6">{message}</p>

        <div className="flex justify-center items-center gap-x-4">
          <button className="py-2 px-4 bg-blue-800 hover:bg-blue-900 rounded-lg" onClick={() => onConfirmation(true)}>
            Sim
          </button>

          <button className="py-2 px-4 bg-red-800 hover:bg-red-900 rounded-lg" onClick={() => onConfirmation(false)}>
            Não
          </button>
        </div>
      </div>
    </section>
  );
}
