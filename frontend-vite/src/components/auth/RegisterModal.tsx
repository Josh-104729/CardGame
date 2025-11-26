import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    UserName: '',
    Password: '',
    ConfirmPassword: '',
    BirthDay: '',
    Gender: 'male',
    Email: '',
    AvatarUrl: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.Password !== formData.ConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.Password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { ConfirmPassword, ...registerData } = formData;
      const result = await register({
        ...registerData,
        AllowedByAdmin: 1, // Default to allowed
      });

      if (result.success) {
        onClose();
        setFormData({
          FirstName: '',
          LastName: '',
          UserName: '',
          Password: '',
          ConfirmPassword: '',
          BirthDay: '',
          Gender: 'male',
          Email: '',
          AvatarUrl: '',
        });
        // Switch to login after successful registration
        onSwitchToLogin();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-teal-900 rounded-lg shadow-2xl w-full max-w-md border-2 border-teal-600 my-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Register</h2>
            <button
              onClick={onClose}
              className="text-teal-200 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="FirstName" className="block text-sm font-medium text-teal-200 mb-2">
                  First Name
                </label>
                <input
                  id="FirstName"
                  name="FirstName"
                  type="text"
                  value={formData.FirstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-teal-800 border border-teal-600 rounded-lg text-white placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label htmlFor="LastName" className="block text-sm font-medium text-teal-200 mb-2">
                  Last Name
                </label>
                <input
                  id="LastName"
                  name="LastName"
                  type="text"
                  value={formData.LastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-teal-800 border border-teal-600 rounded-lg text-white placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="UserName" className="block text-sm font-medium text-teal-200 mb-2">
                Username
              </label>
              <input
                id="UserName"
                name="UserName"
                type="text"
                value={formData.UserName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-teal-800 border border-teal-600 rounded-lg text-white placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="Email" className="block text-sm font-medium text-teal-200 mb-2">
                Email
              </label>
              <input
                id="Email"
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-teal-800 border border-teal-600 rounded-lg text-white placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="Password" className="block text-sm font-medium text-teal-200 mb-2">
                Password
              </label>
              <input
                id="Password"
                name="Password"
                type="password"
                value={formData.Password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-teal-800 border border-teal-600 rounded-lg text-white placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="ConfirmPassword" className="block text-sm font-medium text-teal-200 mb-2">
                Confirm Password
              </label>
              <input
                id="ConfirmPassword"
                name="ConfirmPassword"
                type="password"
                value={formData.ConfirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-teal-800 border border-teal-600 rounded-lg text-white placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="BirthDay" className="block text-sm font-medium text-teal-200 mb-2">
                  Birth Date
                </label>
                <input
                  id="BirthDay"
                  name="BirthDay"
                  type="date"
                  value={formData.BirthDay}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-teal-800 border border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="Gender" className="block text-sm font-medium text-teal-200 mb-2">
                  Gender
                </label>
                <select
                  id="Gender"
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-teal-800 border border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={onSwitchToLogin}
              className="text-teal-300 hover:text-teal-200 text-sm transition-colors"
            >
              Already have an account? <span className="font-semibold">Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

