import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { todoAPI, Todo, TodoFormData } from '@/lib/api'
import { showSuccess, showError } from '@/lib/toast'

export function useTodosQuery() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      try {
        const result = await todoAPI.getAllTodos()
        if (result.error) throw new Error(result.error.message)

        return result.data || []
      } catch (error) {
        showError(
          error instanceof Error ? error.message : 'Failed to load tasks',
        )
        throw error
      }
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useCreateTodoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (todoData: TodoFormData) => todoAPI.createTodo(todoData),

    onMutate: async (newTodoData) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']) || []

      const tempId = `temp-${Date.now()}`

      const optimisticTodo: Todo = {
        id: tempId,
        title: newTodoData.title,
        description: newTodoData.description || null,
        is_completed: newTodoData.is_completed || false,
        priority: newTodoData.priority,
        due_date: newTodoData.due_date || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: newTodoData.status || 'active',
        user_id: 'temp',
      }

      queryClient.setQueryData<Todo[]>(['todos'], (old) => [
        optimisticTodo,
        ...(old || []),
      ])

      return { previousTodos, tempId }
    },

    onError: (err, newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
      showError(err instanceof Error ? err.message : 'Error creating task')
    },

    onSuccess: (result, variables, context) => {
      if (result.data && context?.tempId) {
        const todoData = result.data

        queryClient.setQueryData<Todo[]>(['todos'], (old) => {
          if (!old) return [todoData]

          if (!todoData.id) {
            console.error('Unexpected API response format:', todoData)
            return old.filter((todo) => todo.id !== context.tempId)
          }

          return old.map((todo) =>
            todo.id === context.tempId ? todoData : todo,
          )
        })
      } else if (!result.data) {
        console.error('Missing data in API response:', result)
        queryClient.invalidateQueries({ queryKey: ['todos'] })
      }
    },

    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['todos'] })
      }, 300)
    },
  })
}

export function useUpdateTodoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Todo> }) => {
      return todoAPI.updateTodo(id, data)
    },

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      queryClient.setQueryData<Todo[]>(['todos'], (old) => {
        if (!old) return []

        return old.map((todo) => {
          if (todo.id === id) {
            const updatedTodo = { ...todo, ...data }

            updatedTodo.updated_at = new Date().toISOString()

            if ('is_completed' in data && data.is_completed === true) {
              updatedTodo.status = 'completed'
            } else if (
              'is_completed' in data &&
              data.is_completed === false &&
              updatedTodo.status === 'completed'
            ) {
              updatedTodo.status = 'active'
            }

            return updatedTodo
          }
          return todo
        })
      })

      return { previousTodos }
    },

    onError: (err, variables, context) => {
      console.error('Error updating todo:', err)

      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }

      showError(err instanceof Error ? err.message : 'Error updating task')
    },

    onSuccess: (result, variables) => {
      if (result.data) {
        const todoData = result.data

        queryClient.setQueryData<Todo[]>(['todos'], (old = []) => {
          return old.map((todo) => {
            if (todo.id === variables.id) {
              if (!todoData.id) {
                console.error('Invalid server response:', todoData)
                return todo
              }
              return { ...todo, ...todoData }
            }
            return todo
          })
        })

        if ('is_completed' in variables.data) {
          const isCompleted = variables.data.is_completed
          showSuccess(
            isCompleted ? 'Task marked as completed' : 'Task marked as active',
          )
        } else if ('status' in variables.data) {
          const status = variables.data.status
          if (status === 'review') {
            showSuccess('Task moved to review')
          } else if (status === 'active') {
            showSuccess('Task approved and moved to active')
          }
        } else {
          showSuccess('Task updated successfully')
        }
      } else {
        console.error('Invalid response from server:', result)
        queryClient.invalidateQueries({ queryKey: ['todos'] })
      }
    },

    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['todos'] })
      }, 300)
    },
  })
}

export function useDeleteTodoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => todoAPI.deleteTodo(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.filter((todo) => todo.id !== id),
      )

      return { previousTodos }
    },

    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }

      showError(err instanceof Error ? err.message : 'Error deleting task')
    },

    onSuccess: () => {
      showSuccess('Task deleted successfully')

      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },

    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['todos'] })
      }, 300)
    },
  })
}
