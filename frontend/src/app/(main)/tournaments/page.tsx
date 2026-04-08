// This route (/tournaments) redirects to homepage since tournaments are shown there.
// Kept for future use as a dedicated tournaments listing page.
import { redirect } from 'next/navigation';

export default function TournamentsPage() {
  redirect('/');
}
