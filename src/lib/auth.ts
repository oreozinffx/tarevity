import { compare, hash } from 'bcryptjs'
import { supabase } from './supabase'

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
  score: number
} {
  const errors: string[] = []
  let score = 0

  if (password.length >= 8) score += 10
  if (password.length >= 12) score += 10
  if (password.length < 8) errors.push('Password must be at least 8 characters')

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasDigit = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  if (hasUppercase) score += 10
  if (hasLowercase) score += 10
  if (hasDigit) score += 10
  if (hasSpecial) score += 20

  if (!hasUppercase) errors.push('Password must contain uppercase letters')
  if (!hasLowercase) errors.push('Password must contain lowercase letters')
  if (!hasDigit) errors.push('Password must contain numeric digits')
  if (!hasSpecial) errors.push('Password must contain special characters')

  const hasRepeatingChars = /(.)\1{2,}/.test(password)
  const hasSequentialChars =
    /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(
      password,
    )

  if (hasRepeatingChars) {
    score -= 10
    errors.push("Password shouldn't contain repeating characters (e.g., 'aaa')")
  }

  if (hasSequentialChars) {
    score -= 10
    errors.push(
      "Password shouldn't contain sequential characters (e.g., 'abc', '123')",
    )
  }

  const uniqueChars = new Set(password).size
  score += Math.min(20, uniqueChars * 2)

  score = Math.max(0, Math.min(100, score))

  return {
    isValid: errors.length === 0,
    errors,
    score,
  }
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await compare(password, hashedPassword)
}

export async function emailExists(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim()

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedEmail)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking if email exists:', error)
    return false
  }

  return !!data
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    return null
  }

  return data
}

export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  const normalizedEmail = email.toLowerCase().trim()

  const hashedPassword = await hashPassword(password)

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        provider: 'email',
      },
    ])
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Email already registered')
    }
    throw new Error(error.message)
  }

  return data
}
