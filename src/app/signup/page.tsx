import SignupForm from "@/components/auth/SignupForm";
import AuthGuard from "@/components/auth/AuthGuard";

export default function SignupPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
        <SignupForm />
      </div>
    </AuthGuard>
  );
}
