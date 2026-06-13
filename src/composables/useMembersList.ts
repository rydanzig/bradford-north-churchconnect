import { ref, onMounted } from "vue";
export function useMembersList() {
    
    const members = ref([])
    const loading = ref(false)
    const error = ref<Error | null>(null)


    const fetchMembers = async () => {
        try {
            loading.value = true;
            // send to backend
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
            const response = await fetch(`${apiBaseUrl}/members`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json()
            members.value = result.data;

            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch members')
            }
        } catch (err) {
            error.value = err instanceof Error
                ? err
                : new Error('Unknown error')
        } finally {
            loading.value = false
        }
    };

    onMounted(fetchMembers)

    const filterTable = async (event: Event) =>  {
        const formElement = event.target as HTMLFormElement
        const keyword = (document.getElementById('member-search-input') as HTMLSelectElement)?.value || ''

        try {
            loading.value = true;
            // send to backend
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
            const response = await fetch(`${apiBaseUrl}/members?keyword=${keyword}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json()
            members.value = result.data;

            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch members')
            }
        } catch (err) {
            error.value = err instanceof Error
                ? err
                : new Error('Unknown error')
        } finally {
            loading.value = false
        }
    }

    return {
        members,
        loading,
        error,
        fetchMembers,
        filterTable
    }
}