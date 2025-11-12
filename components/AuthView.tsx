import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon, MotorcycleIcon } from './icons';
import { AuthError } from 'firebase/auth';

const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signUpWithEmail, signInWithEmail } = useAuth();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError('No se pudo iniciar sesión con Google. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (e) {
        const authError = e as AuthError;
        switch (authError.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                setError('Correo o contraseña incorrectos.');
                break;
            case 'auth/email-already-in-use':
                setError('Este correo electrónico ya está en uso.');
                break;
            case 'auth/weak-password':
                setError('La contraseña debe tener al menos 6 caracteres.');
                break;
            default:
                setError('Ocurrió un error. Inténtalo de nuevo.');
        }
        setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
            <MotorcycleIcon className="w-16 h-16 text-[#00f6ff]"/>
            <h1 className="text-4xl font-bold text-white mt-4">Mi Garage</h1>
            <p className="text-gray-400 mt-2">Tu bitácora digital de mantenimiento.</p>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-lg p-8 shadow-2xl shadow-black/30">
          <h2 className="text-2xl font-bold text-center text-white mb-6">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/50 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-[#00f6ff] focus:border-[#00f6ff] outline-none transition-all duration-300"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/50 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-[#00f6ff] focus:border-[#00f6ff] outline-none transition-all duration-300"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00f6ff] hover:shadow-lg hover:shadow-[#00f6ff]/40 text-black font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:scale-100"
            >
              {loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Registrarse')}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-gray-500 text-sm">O</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            <GoogleIcon className="w-5 h-5 mr-3" />
            Continuar con Google
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-semibold text-[#00f6ff] hover:underline ml-2">
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
