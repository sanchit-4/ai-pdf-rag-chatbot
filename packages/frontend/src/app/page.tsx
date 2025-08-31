
// import { Chat } from "@/components/Chat";

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-12">
//       <Chat />
//     </main>
//   );
// }

import { Chat } from '@/components/Chat'; // Or your actual import path

export default function HomePage() {
  return (
    // Add classes to the main container to center everything
    <main className="pageContainer">
      <Chat />
    </main>
  );
}