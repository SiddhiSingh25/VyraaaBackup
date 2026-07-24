// components/PageLoader.tsx

import { DNA } from "react-loader-spinner";

type Props = {
  loading: boolean;
  text?: string;
};

export default function PageLoader({ loading, text = "Loading..." }: Props) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background/40 backdrop-blur-md">
      <div className="flex flex-col items-center">
        <DNA
          visible
          height={90}
          width={90}
          ariaLabel="loading"
          dnaColorOne="#835240"
          dnaColorTwo="#835240"
        />

        <p className="mt-4 text-base font-semibold text-heading">{text}</p>

        <p className="text-sm text-muted">Please wait...</p>
      </div>
    </div>
  );
}
