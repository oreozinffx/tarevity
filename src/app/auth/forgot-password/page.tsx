import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata = {
  title: 'Recuperar Senha | Tarevity',
  description: 'Recupere sua senha do Tarevity',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <ForgotPasswordForm />
    </div>
  );
}