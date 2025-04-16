import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

export function useTokenValidation() {
  const router = useRouter()

  const validateToken = () => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return false
    }
    return true
  }

  onMounted(() => {
    validateToken()
  })

  return {
    validateToken
  }
}
