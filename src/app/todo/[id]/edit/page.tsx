import { Suspense } from 'react'
import { Metadata } from 'next'
import Layout from '@/components/layout/Layout'
import TodoEditPage from '@/components/todos/TodoEditPage'

export const metadata: Metadata = {
  title: 'Edit Task | Tarevity',
  description: 'Modify task details, update due dates, change priority levels, or edit descriptions.',
  robots: 'noindex, nofollow',
}

export default async function TodoEditPageRoute(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  
  return (
    <Layout>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <TodoEditPage todoId={id} />
      </Suspense>
    </Layout>
  )
}