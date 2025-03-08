import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | Tarevity",
  description: "Entre em sua conta Tarevity",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <LoginForm />
    </div>
  );
}
