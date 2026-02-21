import { ProfileProvider } from '@/lib/profile-context';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <ProfileProvider>{children}</ProfileProvider>;
}
