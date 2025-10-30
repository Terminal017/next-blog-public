import { signIn, signOut } from '../../../../auth'

export default function SignInButton() {
  return (
    <div className="mb-8 flex h-6 w-full items-center justify-center">
      <form
        action={async () => {
          'use server'
          await signIn('google')
        }}
      >
        <button
          type="submit"
          className="rounded-sm bg-sky-300 px-3 py-2 text-xl"
        >
          Signin with Google
        </button>
      </form>
    </div>
  )
}
