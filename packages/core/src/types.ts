export interface User {
  id: string;
  displayName: string;
}

export interface Card {
  id: string;
  content: string;
  belongsTo: string;
  revealed: boolean;
  selected: boolean;
  children: string[];
  iteration: number;
}

export interface BrainstormingState {
  id: string;
  topic: string;
  iteration: number;
  moderatorId: string;
  participants: User[];
  cards: Card[];
  timer: Timer;
}

export interface Timer {
  pause: boolean;
  rest: number;
}
