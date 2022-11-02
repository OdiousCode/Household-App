import { avatarColors } from "./Colors";
import { Avatar } from "../data/APItypes";

export const AvatarIcon = {
  icon_Fox: "🦊",
  icon_Frog: "🐸",
  icon_Squid: "🐙",
  icon_Whale: "🐳",
  icon_Chicken: "🐤",
  icon_Pig: "🐷",
};

const avatars: Avatar[] = [
  {
    color: avatarColors.avatar_Fox,
    icon: AvatarIcon.icon_Fox,
  },
  {
    color: avatarColors.avatar_Frog,
    icon: AvatarIcon.icon_Frog,
  },
  {
    color: avatarColors.avatar_Squid,
    icon: AvatarIcon.icon_Squid,
  },
  {
    color: avatarColors.avatar_Whale,
    icon: AvatarIcon.icon_Whale,
  },
  {
    color: avatarColors.avatar_Chicken,
    icon: AvatarIcon.icon_Chicken,
  },
  {
    color: avatarColors.avatar_Pig,
    icon: AvatarIcon.icon_Pig,
  },
];
export function getAllAvatars(): Avatar[] {
  let allAvatars = avatars;
  //allAvatars.push({ icon: "❓", color: "#3d3635" });

  return allAvatars;
}

export function getAvatar(index: number): Avatar {
  if (index == -1) {
    //TODO -?- icon
    return { icon: "❓", color: "#3d3635" };
  }
  return avatars[index];
}

export function getColorByAvatar(avatar: string): string {
  let allAvatars = getAllAvatars();
  allAvatars.push({ icon: "❓", color: "#3d3635" });

  let index = allAvatars.findIndex((a) => a.icon === avatar);

  return allAvatars[index].color;
}
