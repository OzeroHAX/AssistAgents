export type Session = {
  userId: string;
  role: 'user' | 'admin';
  token: string;
};

export function canReadAdminData(session: Session | null): boolean {
  if (!session) return false;
  return session.role === 'admin';
}
