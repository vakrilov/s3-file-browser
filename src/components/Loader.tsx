import { VscLoading } from "react-icons/vsc";
import cx from "clsx";
import "./Loader.scss";
import { FC } from "react";

type Props = {
  variant?: "small" | "medium" | "large";
  className?: string;
};

export const Loader: FC<Props> = ({ variant = "small", className }) => (
  <VscLoading className={cx("loader", variant, className)} />
);
