"use client";
import Image from "next/image";
import { useState } from "react";

interface Props {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

const Avatar = ({ src, alt = "picture", width = 30, height = 30 }: Props) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className="rounded-circle shadow-sm"
      style={{
        objectFit: "cover",
        objectPosition: "center top",
        width: `${width}px`,
        height: `${height}px`,
      }}
      onError={() => setImgSrc("/images/dp1.png")}
    />
  );
};

export default Avatar;
