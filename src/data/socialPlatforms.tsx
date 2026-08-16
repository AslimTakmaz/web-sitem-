import type { ReactNode } from "react";

export type SocialPlatformId =
  | "instagram"
  | "x"
  | "youtube"
  | "tiktok"
  | "facebook"
  | "discord"
  | "telegram"
  | "whatsapp"
  | "medium"
  | "behance"
  | "dribbble"
  | "twitch"
  | "reddit"
  | "spotify"
  | "threads"
  | "pinterest"
  | "snapchat"
  | "mastodon"
  | "gitlab"
  | "codepen"
  | "custom";

export interface SocialPlatform {
  id: SocialPlatformId;
  label: string;
  placeholder: string;
  color: string;
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/kullanici", color: "#E4405F" },
  { id: "x", label: "X (Twitter)", placeholder: "https://x.com/kullanici", color: "#111111" },
  { id: "youtube", label: "YouTube", placeholder: "https://youtube.com/@kanal", color: "#FF0000" },
  { id: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@kullanici", color: "#010101" },
  { id: "facebook", label: "Facebook", placeholder: "https://facebook.com/kullanici", color: "#1877F2" },
  { id: "discord", label: "Discord", placeholder: "https://discord.gg/davet", color: "#5865F2" },
  { id: "telegram", label: "Telegram", placeholder: "https://t.me/kullanici", color: "#26A5E4" },
  { id: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/905xxxxxxxxx", color: "#25D366" },
  { id: "threads", label: "Threads", placeholder: "https://threads.net/@kullanici", color: "#101010" },
  { id: "medium", label: "Medium", placeholder: "https://medium.com/@kullanici", color: "#000000" },
  { id: "behance", label: "Behance", placeholder: "https://behance.net/kullanici", color: "#1769FF" },
  { id: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/kullanici", color: "#EA4C89" },
  { id: "twitch", label: "Twitch", placeholder: "https://twitch.tv/kullanici", color: "#9146FF" },
  { id: "reddit", label: "Reddit", placeholder: "https://reddit.com/u/kullanici", color: "#FF4500" },
  { id: "spotify", label: "Spotify", placeholder: "https://open.spotify.com/user/...", color: "#1DB954" },
  { id: "pinterest", label: "Pinterest", placeholder: "https://pinterest.com/kullanici", color: "#E60023" },
  { id: "snapchat", label: "Snapchat", placeholder: "https://snapchat.com/add/kullanici", color: "#FFFC00" },
  { id: "mastodon", label: "Mastodon", placeholder: "https://mastodon.social/@kullanici", color: "#6364FF" },
  { id: "gitlab", label: "GitLab", placeholder: "https://gitlab.com/kullanici", color: "#FC6D26" },
  { id: "codepen", label: "CodePen", placeholder: "https://codepen.io/kullanici", color: "#000000" },
  { id: "custom", label: "Diğer", placeholder: "https://...", color: "#8b949e" },
];

export function findPlatformByLabel(label: string): SocialPlatform | undefined {
  const normalized = label.trim().toLowerCase();
  return SOCIAL_PLATFORMS.find(
    (platform) =>
      platform.label.toLowerCase() === normalized ||
      platform.id === normalized ||
      (platform.id === "x" && (normalized === "twitter" || normalized === "x (twitter)")),
  );
}

function IconShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {children}
    </svg>
  );
}

export function SocialPlatformIcon({ id, className }: { id: SocialPlatformId | string; className?: string }) {
  switch (id) {
    case "instagram":
      return (
        <IconShell className={className}>
          <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm6.5-.9a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
        </IconShell>
      );
    case "x":
      return (
        <IconShell className={className}>
          <path d="M18.244 2H21l-6.52 7.45L22 22h-6.19l-4.84-6.33L5.4 22H2.64l6.99-7.99L2 2h6.35l4.37 5.8L18.244 2zm-1.08 18.2h1.72L7.01 3.69H5.16l11.99 16.51z" />
        </IconShell>
      );
    case "youtube":
      return (
        <IconShell className={className}>
          <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
        </IconShell>
      );
    case "tiktok":
      return (
        <IconShell className={className}>
          <path d="M19.6 7.2a6.7 6.7 0 01-3.9-1.3v7.5a5.8 5.8 0 11-5-5.7v2.7a3.1 3.1 0 103.1 3v-12h2.7c.3 1.7 1.5 3.2 3.1 3.9v2z" />
        </IconShell>
      );
    case "facebook":
      return (
        <IconShell className={className}>
          <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3.1l.9-3H13v-2c0-.6.4-1 1-1z" />
        </IconShell>
      );
    case "discord":
      return (
        <IconShell className={className}>
          <path d="M20.3 4.4A18 18 0 0015.9 3l-.3.6a15.8 15.8 0 014.2 2.1 13.6 13.6 0 00-12.6 0A15.8 15.8 0 0111.4 3.6L11.1 3a18 18 0 00-4.4 1.4C3.4 8.3 2.5 12.1 2.9 15.8a18.2 18.2 0 005.5 2.8l.7-1.1a11.7 11.7 0 01-1.8-.9l.4-.3c3.4 1.6 7.1 1.6 10.5 0l.4.3c-.6.4-1.2.7-1.8.9l.7 1.1a18.2 18.2 0 005.5-2.8c.5-4.3-.8-8-3.1-11.4zM9.4 13.8c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8zm5.2 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8z" />
        </IconShell>
      );
    case "telegram":
      return (
        <IconShell className={className}>
          <path d="M21.9 4.2L2.8 11.5c-1.3.5-1.3 1.2-.2 1.5l4.9 1.5 1.9 5.8c.2.7.4 1 .9 1 .6 0 .8-.2 1.1-.5l2.7-2.6 5.6 4.1c1 .6 1.8.3 2.1-.9l3.7-17.4c.4-1.5-.5-2.2-1.6-1.8z" />
        </IconShell>
      );
    case "whatsapp":
      return (
        <IconShell className={className}>
          <path d="M12 2a10 10 0 00-8.7 14.9L2 22l5.3-1.4A10 10 0 1012 2zm5.4 14.2c-.2.7-1.3 1.2-2.1 1.4-.6.1-1.3.2-3.8-.8-3.2-1.3-5.3-4.5-5.4-4.7-.2-.2-1.4-1.9-1.4-3.6s.9-2.5 1.2-2.9c.3-.3.7-.4 1-.4h.7c.2 0 .5 0 .7.6l1 2.4c.1.2.1.4 0 .6l-.4.7c-.2.2-.3.4-.1.7.2.3.7 1.2 1.6 1.9 1.1 1 2 1.3 2.3 1.4.3.1.5.1.7-.1l1-.1c.2-.1.5-.2.6-.4.1-.2.5-1.3.6-1.7.1-.4.2-.4.4-.3l2.3 1.1c.3.1.4.2.5.3.1.3 0 1.1-.2 1.8z" />
        </IconShell>
      );
    case "medium":
      return (
        <IconShell className={className}>
          <path d="M4.2 7.2c0-.3-.1-.6-.4-.8L2 4.6v-.3h6.1l4.7 10.3L16.9 4.3H23v.3l-1.6 1.5c-.1.1-.2.3-.2.5v11.2c0 .2.1.4.2.5l1.6 1.5v.3h-8v-.3l1.6-1.6c.2-.2.2-.2.2-.5V8.3L11.4 20h-.6L4.6 8.3v7.8c0 .4.1.8.4 1.1l2.4 2.9v.3H2v-.3l2.4-2.9c.3-.3.4-.7.4-1.1V7.2z" />
        </IconShell>
      );
    case "behance":
      return (
        <IconShell className={className}>
          <path d="M8.5 11.2c1.1-.3 1.8-1 1.8-2.2C10.3 7.3 9 6.5 7.1 6.5H2v11h5.4c2.1 0 3.6-1.1 3.6-3.1 0-1.4-.7-2.4-2.5-3.2zM5 8.4h2c.9 0 1.4.4 1.4 1.1S7.9 10.6 7 10.6H5V8.4zm2.2 7.2H5v-2.8h2.3c1.1 0 1.7.5 1.7 1.4s-.6 1.4-1.8 1.4zM15.7 9.8c-2.6 0-4.3 1.8-4.3 4.3 0 2.6 1.7 4.3 4.5 4.3 1.9 0 3.2-.8 3.9-2.2l-1.7-.7c-.4.8-1.1 1.2-2.1 1.2-1.2 0-2.1-.7-2.3-2h6.4v-.6c0-2.9-1.6-4.3-4.4-4.3zm-2.1 3.3c.2-1.1 1-1.8 2.1-1.8s1.9.7 2 1.8h-4.1zM14.5 6.5h5v1.5h-5z" />
        </IconShell>
      );
    case "dribbble":
      return (
        <IconShell className={className}>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.6 4.7a8 8 0 01.9 3.4 18.3 18.3 0 00-5.7-.3 29 29 0 00-1.5-3.4 8.1 8.1 0 016.3.3zM11 5.2a27 27 0 011.6 3.5 26 26 0 00-6.4 1.1A8.1 8.1 0 0111 5.2zM4.1 12.1l.2-.1a28 28 0 017.3-1.3c.4 1 .8 2 1.1 3.1a18.5 18.5 0 00-5.4 4.5 8.1 8.1 0 01-3.2-6.2zm4.6 7a16.6 16.6 0 014.9-4.1 31 31 0 012.2 6 8.1 8.1 0 01-7.1-1.9zm8.8.4a33 33 0 00-2-5.6 16.4 16.4 0 015.1.5 8 8 0 01-3.1 5.1z" />
        </IconShell>
      );
    case "twitch":
      return (
        <IconShell className={className}>
          <path d="M3 2l-1 3v15h5v3h3l3-3h4l5-5V2H3zm16 11l-3 3h-4l-3 3v-3H6V4h13v9zM15 7h2v5h-2V7zm-5 0h2v5h-2V7z" />
        </IconShell>
      );
    case "reddit":
      return (
        <IconShell className={className}>
          <path d="M14.2 3.3l1.5 4.8a4.2 4.2 0 012.5.8 1.7 1.7 0 11-1.1 1.5 2.7 2.7 0 00-2.7-1.4H9.6a2.7 2.7 0 00-2.7 1.4 1.7 1.7 0 11-1.1-1.5 4.2 4.2 0 012.5-.8l1.6-5 1.5.4-.1.3a1.4 1.4 0 101.1-.4l1.8-.3zM8.6 13.2a1.3 1.3 0 110 2.6 1.3 1.3 0 010-2.6zm6.8 0a1.3 1.3 0 110 2.6 1.3 1.3 0 010-2.6zM8.8 17a4.8 4.8 0 006.4 0l.9.9a6 6 0 01-8.2 0L8.8 17z" />
        </IconShell>
      );
    case "spotify":
      return (
        <IconShell className={className}>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.4a.8.8 0 01-1.1.3 10.6 10.6 0 00-7.5-.9.8.8 0 01-.5-1.5 12.2 12.2 0 018.7 1.1c.4.2.5.7.4 1zm1.2-2.7a1 1 0 01-1.3.3 13.4 13.4 0 00-9.3-1.1 1 1 0 01-.6-1.8 15.4 15.4 0 0110.8 1.3c.5.2.6.8.4 1.3zm.1-2.8a1.1 1.1 0 01-1.5.4 16.5 16.5 0 00-10.9-1.3 1.1 1.1 0 11-.4-2.2 18.7 18.7 0 0112.4 1.5c.6.3.8 1 .4 1.6z" />
        </IconShell>
      );
    case "threads":
      return (
        <IconShell className={className}>
          <path d="M16.2 10.4c-.1-2.3-1.4-3.8-3.8-4-1.7-.1-3.1.6-3.7 1.9l1.7.8c.3-.7 1-.1 1.9 1.1 1.4.4 2.3 1 2.7 1.9-1-.5-2.1-.7-3.3-.7-2.6 0-4.3 1.7-4.3 4 0 2.4 1.9 4 4.5 4 1.8 0 3.2-.7 3.9-1.9.5.6.8 1.3.8 2.1 0 2.2-1.7 3.7-4.7 3.7-3 0-5-1.8-5-4.7 0-.6.1-1.2.2-1.7l-1.8-.3c-.2.7-.3 1.4-.3 2.1 0 4 2.7 6.4 6.9 6.4 4.1 0 6.5-2.2 6.5-5.6 0-2.2-1-3.8-2.6-4.8zm-3.8 5.4c-1.5 0-2.5-.9-2.5-2.2 0-1.4 1.1-2.3 2.8-2.3 1 0 1.9.2 2.6.6-.3 1.9-1.5 3.9-2.9 3.9z" />
        </IconShell>
      );
    case "pinterest":
      return (
        <IconShell className={className}>
          <path d="M12 2a10 10 0 00-3.6 19.3c-.1-.8-.2-2 .1-2.9.2-.8 1.5-6.4 1.5-6.4s-.4-.8-.4-1.9c0-1.8 1-3.1 2.3-3.1 1.1 0 1.6.8 1.6 1.8 0 1.1-.7 2.7-1.1 4.2-.3 1.3.7 2.3 2 2.3 2.3 0 3.9-3 3.9-6.5 0-2.7-1.8-4.7-5.1-4.7-3.7 0-6 2.7-6 5.8 0 1.1.3 1.8.8 2.4.2.2.2.3.1.6l-.3 1.1c-.1.3-.3.4-.6.3-1.7-.7-2.5-2.6-2.5-4.7 0-3.5 3-7.7 8.9-7.7 4.8 0 7.9 3.4 7.9 7.2 0 4.9-2.7 8.6-6.8 8.6-1.4 0-2.6-.7-3.1-1.6l-.8 3.2c-.3 1.1-1.1 2.4-1.7 3.3A10 10 0 0012 22 10 10 0 0012 2z" />
        </IconShell>
      );
    case "snapchat":
      return (
        <IconShell className={className}>
          <path d="M12 2c2.6 0 4.2 1.8 4.2 4.5v1.1c0 .7.1 1.2.4 1.5l.6.5c1 .8 1.8 1.7 1.8 2.9 0 .7-.4 1.3-1.2 1.6-.2.1-.3.2-.3.4 0 .4.5.7 1.1 1 .9.4 1.9.9 1.9 2 0 1.5-1.7 2.2-3.2 2.5-1 .2-1.4.5-1.6 1-.3.6-.8 1-2.1 1h-2.3c-1.3 0-1.8-.4-2.1-1-.2-.5-.6-.8-1.6-1-1.5-.3-3.2-1-3.2-2.5 0-1.1 1-1.6 1.9-2 .6-.3 1.1-.6 1.1-1 0-.2-.1-.3-.3-.4-.8-.3-1.2-.9-1.2-1.6 0-1.2.8-2.1 1.8-2.9l.6-.5c.3-.3.4-.8.4-1.5V6.5C7.8 3.8 9.4 2 12 2z" />
        </IconShell>
      );
    case "mastodon":
      return (
        <IconShell className={className}>
          <path d="M12 2c-3.4 0-6.2.9-7.7 2.6C2.7 6.4 2 8.8 2 12.1v3.2c0 3.2.8 5.7 3.1 6.7 1.1.5 2.4.6 3.5.2V19c-1.2.3-2.6.2-3.4-.2-1.2-.6-1.4-2.5-1.4-3.7h.1c.5.7 1.4 1.3 2.8 1.3 2.2 0 3.8-1.2 3.8-3.5V8.4h-2.5v5c0 .9-.5 1.5-1.4 1.5-.9 0-1.5-.6-1.5-1.5V8.4H6.6v4.9c0 2 1.1 3.8 3.9 3.8 1.1 0 2.1-.3 2.9-1v3.9c3.4.4 6.2-.3 7.4-2.2 1.1-1.7 1.2-4.4 1.2-7.7 0-3.3-.7-5.7-2.3-7.5C18.2 2.9 15.4 2 12 2z" />
        </IconShell>
      );
    case "gitlab":
      return (
        <IconShell className={className}>
          <path d="M12 21.3L16.4 8.7H7.6L12 21.3zM2.1 8.7L.4 13.8c-.2.5 0 1 .4 1.3L12 21.3 2.1 8.7zm19.8 0L12 21.3l9.5-6.2c.4-.3.6-.8.4-1.3l-1.7-5.1h1.7zM16.4 8.7l-2.1-6.3c-.2-.5-.9-.5-1.1 0L12 8.7h4.4zM7.6 8.7l2.1-6.3c.2-.5.9-.5 1.1 0L12 8.7H7.6z" />
        </IconShell>
      );
    case "codepen":
      return (
        <IconShell className={className}>
          <path d="M12 2L1.5 9v6L12 22l10.5-7V9L12 2zm0 2.3l7.7 5.1-3.3 2.2-4.4-2.9-4.4 2.9-3.3-2.2L12 4.3zM3.5 11.4l2.6 1.7-2.6 1.7v-3.4zm0 5.1l7.7 5.2v-4.5l-4.4-2.9-3.3 2.2zm8.5 5.2l7.7-5.2-3.3-2.2-4.4 2.9v4.5zm8.5-6.8l-2.6-1.7 2.6-1.7v3.4zM12 13.4l4.4-2.9L12 7.6 7.6 10.5 12 13.4z" />
        </IconShell>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
        </svg>
      );
  }
}

export function resolveSocialIcon(label: string): ReactNode {
  const platform = findPlatformByLabel(label);
  return <SocialPlatformIcon id={platform?.id ?? "custom"} />;
}
