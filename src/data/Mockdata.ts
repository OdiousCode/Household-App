import { Household, Profile, User, Task, TaskHistory } from "./APItypes";

const mockUser: User[] = [
  {
    email: "fakeEmail@email.com",
    id: 1,
    password: "bralösenord",
  },
];

const mockProfile: Profile[] = [
  {
    id: 7,
    userId: 1,
    householdId: 1,
    avatar: { color: "#00FF00", icon: "fox" }, // asset url?
    name: "Fillip",
    pending: false,
    role: "Admin",
  },
];
const mockHousehold: Household[] = [
  {
    id: 1,
    entrenceCode: "ENKELKOD",
    name: "Stugan",
  },
];

const mockTask: Task[] = [
  {
    id: 1,
    difficulty: 4,
    frequency: 3,
    householdId: 1,
    isArchived: false,
    name: "diska",
    description: "bara diska",
  },
];

const mockTaskHistory: TaskHistory[] = [
  {
    id: 1,
    profileId: 1,
    taskId: 1,

    date: Date.now(),
  },
];

export function getUser(email: string, password: string) {
  return mockUser.find((p) => p.email === email && p.password === password);
}
export function getProfiles(userId: number) {
  return mockProfile.find((p) => p.userId === userId);
}
//mby just loop and get all based on profileId???
export function getHousehold(profile_householdId: number) {
  return mockHousehold.find((p) => p.id === profile_householdId);
}
export function getTasks(householdId: number) {
  return mockTask.find((p) => p.householdId === householdId);
}
export function getTaskHistory(profileId: number) {
  return mockTaskHistory.find((p) => p.profileId === profileId);
}
