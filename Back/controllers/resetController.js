import { resetPassword, updatePassword, getSession } from './authController.js'

export const handleResetPassword = async (req, res) => {
  const { email } = req.body

  try {
    const result = await resetPassword(email)
    res.status(result.success ? 200 : 400).json(result)
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const handleUpdatePassword = async (req, res) => {
  const { newPassword } = req.body

  try {
    const session = await getSession()
    if (!session) {
      return res.status(401).json({ success: false, message: 'No active session' })
    }

    const result = await updatePassword(newPassword, session.access_token)
    res.status(result.success ? 200 : 400).json(result)
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
export const handleGetSession = async (req, res) => {
    try {
      const { data, error } = await supabase.auth.getSession()
  
      if (error) {
        console.error('Error getting session:', error.message)
        return res.status(500).json({ success: false, message: 'Failed to retrieve session' })
      }
  
      if (data.session) {
        // Session exists
        res.status(200).json({
          success: true,
          session: {
            user: data.session.user,
            expires_at: data.session.expires_at,
            access_token: data.session.access_token
          }
        })
      } else {
        // No active session
        res.status(401).json({ success: false, message: 'No active session' })
      }
    } catch (error) {
      console.error('Unexpected error in handleGetSession:', error)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }