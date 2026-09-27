import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AuthError, MissingIdentityError } from '@netlify/identity'
import { useAuth } from '../hooks/useAuth'
import MatrixRain from '../components/MatrixRain'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function describeAuthError(error: unknown): string {
  if (error instanceof MissingIdentityError) {
    return "L'authentification n'est pas disponible pour le moment."
  }
  if (error instanceof AuthError) {
    switch (error.status) {
      case 401:
        return 'Email ou mot de passe invalide.'
      case 403:
        return 'Les inscriptions sont désactivées.'
      case 422:
        return 'Email ou mot de passe invalide (le mot de passe doit faire au moins 6 caractères).'
      case 404:
        return 'Aucun compte trouvé avec cet email.'
      default:
        return error.message
    }
  }
  return "Une erreur inattendue s'est produite."
}

function LoginPage() {
  const { user, login, signup, logout } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pseudonym, setPseudonym] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    const trimmedEmail = email.trim()
    const trimmedPseudonym = pseudonym.trim()

    if (mode === 'signup' && trimmedPseudonym.length < 3) {
      setError('Choisissez un pseudonyme d’au moins 3 caractères.')
      return
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        const { confirmed } = await signup(trimmedEmail, password, trimmedPseudonym)
        if (confirmed) {
          navigate({ to: '/' })
        } else {
          setInfo(
            'Compte créé. Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.',
          )
          setMode('login')
        }
      } else {
        await login(trimmedEmail, password)
        navigate({ to: '/' })
      }
    } catch (err) {
      setError(describeAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <MatrixRain />
      <div className="relative z-10 w-full max-w-sm rounded-xl border border-matrix-border bg-matrix-dark/80 p-6 box-glow">
        <h1 className="text-center text-xl font-bold text-matrix-green text-glow tracking-tight mb-1">
          DATA<span className="text-white">://</span>HARVEST
        </h1>
        <p className="text-center text-xs text-white/30 tracking-widest mb-6">
          ACCÈS TERMINAL
        </p>

        {user ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-white/60">
              Connecté en tant que{' '}
              <span className="text-matrix-green">{user.pseudonym}</span>
            </p>
            <button
              onClick={() => navigate({ to: '/' })}
              className="w-full px-4 py-2 rounded border border-matrix-green text-matrix-green hover:bg-matrix-green/10 text-sm font-semibold"
            >
              Retour au jeu
            </button>
            <button
              onClick={() => logout()}
              className="text-xs text-white/40 hover:text-matrix-green underline underline-offset-2"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <>
            <div className="flex mb-5 rounded-lg border border-matrix-border overflow-hidden text-sm">
              <button
                onClick={() => {
                  setMode('login')
                  setError(null)
                  setInfo(null)
                }}
                className={`flex-1 py-2 ${mode === 'login' ? 'bg-matrix-green/10 text-matrix-green' : 'text-white/40 hover:text-white/70'}`}
              >
                Connexion
              </button>
              <button
                onClick={() => {
                  setMode('signup')
                  setError(null)
                  setInfo(null)
                }}
                className={`flex-1 py-2 ${mode === 'signup' ? 'bg-matrix-green/10 text-matrix-green' : 'text-white/40 hover:text-white/70'}`}
              >
                Créer un compte
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {mode === 'signup' && (
                <label className="flex flex-col gap-1 text-xs text-white/50">
                  Pseudonyme
                  <input
                    value={pseudonym}
                    onChange={(e) => setPseudonym(e.target.value)}
                    maxLength={24}
                    placeholder="Agent_42"
                    className="rounded border border-matrix-border bg-matrix-panel px-3 py-2 text-sm text-white outline-none focus:border-matrix-green/60"
                  />
                </label>
              )}
              <label className="flex flex-col gap-1 text-xs text-white/50">
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@reseau.io"
                  className="rounded border border-matrix-border bg-matrix-panel px-3 py-2 text-sm text-white outline-none focus:border-matrix-green/60"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-white/50">
                Mot de passe
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded border border-matrix-border bg-matrix-panel px-3 py-2 text-sm text-white outline-none focus:border-matrix-green/60"
                />
              </label>

              {error && <p className="text-xs text-red-400">{error}</p>}
              {info && <p className="text-xs text-matrix-green">{info}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 px-4 py-2 rounded border border-matrix-green text-matrix-green hover:bg-matrix-green/10 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Connexion en cours…'
                  : mode === 'signup'
                    ? 'Créer mon compte'
                    : 'Se connecter'}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-xs text-white/40">
          Un compte permet de sauvegarder votre progression et d’y accéder
          depuis n’importe quel appareil. Le jeu reste jouable sans compte.
        </p>
        <Link
          to="/"
          className="mt-3 block text-center text-xs text-white/30 hover:text-matrix-green underline underline-offset-2"
        >
          Retour au jeu sans se connecter
        </Link>
      </div>
    </div>
  )
}
