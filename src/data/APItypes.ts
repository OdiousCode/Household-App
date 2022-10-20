export interface User {
  id: number;
  email: string;
  password: string;
}

export interface Profile {
  id: number;
  userId: string;
  householdId: number;

  name: string;
  role: "Admin" | "User";
  avatar: number; // 0 - 5
  pending: boolean;
}

export interface Household {
  id: string;
  entrenceCode: string;
  name: string;
}

export interface Task {
  id: number;
  householdId: number;
  name: string;
  description?: string;

  difficulty: number;
  frequency: number;

  voice?: string; // mp3
  img?: string; // img

  isArchived: boolean;
}

export interface TaskHistory {
  id: number;
  taskId: number;
  profileId: number;

  date: number;
}

export interface Avatar {
  icon: string;
  color: string; //####4444
}
