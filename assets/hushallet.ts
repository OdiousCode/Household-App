export interface Profile {
  id: number;
  name: string;

  login: string;
  password: string;

  // perhaps localstorage, or here
  knownHouseHolds: string[];
}

export interface User {
  id: number; //-- bound to profile?

  name: string;
  role: string; // potential interface
  avatar: avatar;
  isActive: boolean;
  pending: boolean;
  //time: Date[]?    times when is active perhaps?
}

export interface Household {
  id: string;
  name: string;
  tasksToDo: tasks[];
  tasksTimeTable: ??[];

  tasksArchive: tasks[];

  owner: userDTO;
  users: userDTO[];
  pendingUsers: userDTO[];
}

export interface tasks {
  id: number;
  name: string;

  difficulty: number;
  respawn: number;
  
  voice?: mp3
  img? : img
}

export interface avatar {
  icon: ??
  color: ??
}

// export function getData(id: number) {
//   return mockQuizWalks.find((p) => p.id === id);
// }
