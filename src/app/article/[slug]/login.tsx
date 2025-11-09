'use server'
import { signIn, signOut } from '../../../../auth'

export async function sign_in_google() {
  await signIn('google')
}

export async function sign_out() {
  await signOut()
}
