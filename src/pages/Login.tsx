import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        const response = await login(email, password)
        localStorage.setItem('token', response.data.access_token)
        navigate('/trips')
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='bg-white p-8 rounded-lg shadow-md w-96'>
                <h1 className='text-2xl font-bold mb-6'>Logowanie</h1>
                    <form onSubmit={handleSubmit} className='w-full max-w-xs'>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Login
                            </label>
                            <input
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Email"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Hasło
                            </label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="text" placeholder="Hasło"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                               Zaloguj
                            </button>
                        </div>
                    </form>
            </div>
        </div>
    )
}

export default Login