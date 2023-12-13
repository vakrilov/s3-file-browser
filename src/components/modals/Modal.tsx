import React, {
  useRef,
  useState,
  FC,
  useEffect,
  PropsWithChildren,
} from "react";
import cx from "clsx";
import { VscClose } from "react-icons/vsc";
import "./Modal.scss";

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
};

type ModalComponent = FC<ModalProps> & {
  Header: FC<PropsWithChildren>;
  Content: FC<PropsWithChildren>;
  Footer: FC<PropsWithChildren>;
};

export const Modal: ModalComponent = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  const [isModalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
    setModalOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;

    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isModalOpen]);

  return (
    <dialog
      ref={modalRef}
      onKeyDown={handleKeyDown}
      className={cx("modal", className)}
    >
      <button className="close-btn" onClick={handleCloseModal}>
        <VscClose />
      </button>
      {children}
    </dialog>
  );
};

Modal.Header = (props) => <h3 className="header" {...props} />;
Modal.Content = (props) => <div className="content" {...props} />;
Modal.Footer = (props) => <div className="footer" {...props} />;
