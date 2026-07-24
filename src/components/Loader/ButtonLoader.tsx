import { TailSpin } from "react-loader-spinner";

type ButtonLoaderProps = {
  size?: number;
  color?: string;
};

export default function ButtonLoader({
  size = 16,
  color = "#ffffff",
}: ButtonLoaderProps) {
  return (
    <TailSpin
      visible={true}
      height={size}
      width={size}
      color={color}
      ariaLabel="button-loading"
      strokeWidth={5}
    />
  );
}
