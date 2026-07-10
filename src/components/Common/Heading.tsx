import { useEffect, useRef, useState } from "react";

interface HeadingProps {
  value: {
    text: string;
    position?: "start" | "center" | "end";
  };
}

const Heading = ({ value }: HeadingProps) => {
  const h1Ref = useRef<HTMLHeadingElement | null>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (h1Ref.current) {
      const headingWidth = Math.floor(
        h1Ref.current.getBoundingClientRect().width
      );
      setWidth(headingWidth + 20);
    }
  }, [value.text]);

  return (
    <div className={`flex flex-col items-${value.position ?? "start"}`}>
      <h1
        ref={h1Ref}
        className="text-admin-text text-3xl md:text-4xl font-semibold mb-2 inline-block"
      >
        {value.text}
      </h1>

      <div
        className="relative border border-border mb-5"
        style={{ width: `${width}px` }}
      >
        <span
          className="absolute left-0 top-[-1px] h-[3px] rounded bg-primary"
          style={{ width: `${width / 3}px` }}
        />
      </div>
    </div>
  );
};

export default Heading;