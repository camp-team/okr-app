export interface User {
  name: string;
  avatarURL: string;
  email: string;
  createdAt: Date;
  userId: string;
  premiumPlan?: boolean;
}
