import * as React from "react";

type TikTokIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export default function TikTokIcon({
  size = 24,
  color = "currentColor",
  className,
}: TikTokIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16.5 3C16.9 4.4 17.8 5.6 19 6.3C19.8 6.8 20.9 7.1 22 7.1V9.9C20.2 9.9 18.6 9.3 17.2 8.3V15.2C17.2 18.3 14.7 20.8 11.6 20.8C8.5 20.8 6 18.3 6 15.2C6 12.1 8.5 9.6 11.6 9.6C12 9.6 12.4 9.7 12.8 9.8V12.8C12.4 12.6 12 12.5 11.6 12.5C10.1 12.5 8.9 13.7 8.9 15.2C8.9 16.7 10.1 17.9 11.6 17.9C13.1 17.9 14.3 16.7 14.3 15.2V3H16.5Z"
        fill={color}
      />
    </svg>
  );
}
