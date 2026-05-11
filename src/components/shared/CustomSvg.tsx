"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { GoogleIcon, type IconProps } from "@/assets/icons/GoogleIcon";

const ICONS: Record<string, React.FC<IconProps>> = {
  google: GoogleIcon,
};

interface CustomSvgProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  title?: string;
  className?: string;
}

const CustomSvg = ({
  name,
  size = 24,
  width,
  height,
  title,
  className,
  ...props
}: CustomSvgProps) => {
  const Icon = ICONS[name];

  if (!Icon) return null;

  return (
    <Icon
      width={width || size}
      height={height || size}
      title={title}
      className={cn(className)}
      {...props}
    />
  );
};

export default CustomSvg;
export { CustomSvg };
