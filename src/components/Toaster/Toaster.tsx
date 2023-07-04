import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  ForwardRefRenderFunction,
} from "react";
import styles from "./Toaster.module.css";

export interface ToasterHandleMethods {
  onShowToaster: (text: string, toastType?: string) => void;
}

export type ToasterProps = {
  show?: boolean;
};

const Toaster: ForwardRefRenderFunction<ToasterHandleMethods, ToasterProps> = (
  {}: ToasterProps,
  ref
) => {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState<any>();

  useImperativeHandle(ref, () => ({
    onShowToaster(text: string,toastType?: string|undefined) {
      setShow(true);
      setText(text);
      setType(toastType);

      setTimeout(() => {
        setShow(false);
        setType("");
      }, 5000);
    },
  }));

  return (
    <div className={`${styles.toaster_wrapper} 
      ${show && styles.toaster_wrapper__show} ${styles[type]}`}>
      {text}
    </div>
  );
};

export default forwardRef(Toaster);
