
import type { SVGProps } from "react";

type SkillIconName =
  | "python"
  | "cybersecurity"
  | "web"
  | "filmmaking"
  | "audio"
  | "music"
  | "space"
  | "writing";

type SkillIconProps = SVGProps<SVGSVGElement> & {
  name: SkillIconName;
};

const iconPaths: Record<SkillIconName, React.ReactNode> = {
  python: (
    <>
      <path d="M12 3H9a4 4 0 0 0-4 4v3h8v2H5a3 3 0 0 0-3 3v2a4 4 0 0 0 4 4h3v-4h5a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4h-2Z" />
      <path d="M9 3v4m6 10v4" />
      <circle cx="9" cy="7" r=".7" fill="currentColor" />
      <circle cx="15" cy="17" r=".7" fill="currentColor" />
    </>
  ),
  cybersecurity: (
    <>
      <path d="M12 2 20 5v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </>
  ),
  web: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m9 9-3 3 3 3m6-6 3 3-3 3m-2-7-2 8" />
    </>
  ),
  filmmaking: (
    <>
      <rect x="3" y="7" width="13" height="10" rx="2" />
      <path d="m16 10 5-3v10l-5-3M7 7l2-3h4l2 3" />
    </>
  ),
  audio: (
    <>
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4m-4 0h8" />
      <path d="M11 5h2m-2 3h2m-2 3h2" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>
  ),
  space: (
    <>
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-30 12 12)" />
      <path d="m17 4 1.5-2L20 4l2 1.5-2 1.5-1.5 2L17 7l-2-1.5L17 4Z" />
    </>
  ),
  writing: (
    <>
      <path d="M12 7v14m0-14C10 4 7 3 3 3v16c4 0 7 1 9 2m0-14c2-3 5-4 9-4v16c-4 0-7 1-9 2" />
      <path d="M6 7h3m-3 4h3m6-4h3m-3 4h3" />
    </>
  ),
};

export default function SkillIcon({
  name,
  className,
  ...props
}: SkillIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="40"
      height="40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={`${name} icon`}
      className={className}
      {...props}
    >
      {iconPaths[name]}
    </svg>
  );
}
