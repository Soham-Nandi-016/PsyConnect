export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { handlers } from "@/auth";

// Export the GET and POST handlers from NextAuth
export const { GET, POST } = handlers;
