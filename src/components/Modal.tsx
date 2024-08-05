interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {children}
    </div>
  );
};
