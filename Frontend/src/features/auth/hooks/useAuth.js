import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const setAuthState = (data) => {
        if (data?.user) {
            setUser(data.user)
            return true
        }

        setUser(null)
        return false
    }

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            return setAuthState(data)
        } catch {
            setUser(null)
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            const success = setAuthState(data)
            return { success, message: success ? "" : "Registration response did not include a user." }
        } catch (error) {
            setUser(null)
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Unable to create your account. Please try again."
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
            return true
        } catch {
            return false
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, handleRegister, handleLogin, handleLogout }
}
