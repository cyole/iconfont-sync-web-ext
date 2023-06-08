import { useStorageLocal } from '~/composables/useStorageLocal'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')

export const uploadToken = useStorageLocal('webext-upload-token', 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMTYyMzU2NTI1MDU1Njk5MzUzNiIsInNjb3BlIjpbInhtIiwieG0tY3JtIiwieG0taHJtIiwieG0tZG1zIl0sInZlcnNpb24iOjF9.UPZ90XTZM1lkdIaE73ka5hRNx1OIIYI95SFeyBSube4')
