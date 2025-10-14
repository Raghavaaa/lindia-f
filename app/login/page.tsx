export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email</label>
            <input id="email" type="email" className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="password">Password</label>
            <input id="password" type="password" className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white bg-black hover:bg-zinc-800">Sign in</button>
        </form>
      </div>
    </div>
  );
}


