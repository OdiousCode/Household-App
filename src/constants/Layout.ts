import { Colors } from "./Colors";
import { Avatar } from "../data/APItypes";
export const AvatarIcon = {
  icon_Fox: "🦊",
  icon_Frog: "🐸",
  icon_Squid: "🐙",
  icon_Whale: "🐳",
  icon_Chicken: "🐤",
  icon_Pig: "🐷",
};

export const avatars: Avatar[] = [ {
    color: Colors.avatar_Fox,
    icon: AvatarIcon.icon_Fox,
 }, 
 {
    color: Colors.avatar_Frog,
    icon: AvatarIcon.icon_Frog,
 }, 
 {
    color: Colors.avatar_Squid,
    icon: AvatarIcon.icon_Squid,
 }, 
 {
    color: Colors.avatar_Whale,
    icon: AvatarIcon.icon_Whale,
 }, 
 {
    color: Colors.avatar_Chicken,
    icon: AvatarIcon.icon_Chicken,
 }, 
 {
    color: Colors.avatar_Pig,
    icon: AvatarIcon.icon_Pig,
 }, 
]
