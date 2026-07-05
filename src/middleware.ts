import { withAuth } from "next-auth/middleware";

export const middlewareOptions = {
  callbacks: {
    authorized({ token }: { token: any }) {
      return !!token;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default withAuth(middlewareOptions);

export const config = {
  matcher: ["/resume-builder/:path*", "/dashboard/:path*"],
};
