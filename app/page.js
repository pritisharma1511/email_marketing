import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect landing page straight to login for MVP
  redirect('/login');
}
