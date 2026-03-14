import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fileApi } from '@/api/file.api'
import { translate } from '@/i18n/LanguageContext'
import type { File, FileCreate, FileUpdate } from '@/types/api'

export const fileKeys = {
	all: ['files'] as const,
	lists: () => [...fileKeys.all, 'list'] as const,
	list: () => [...fileKeys.lists()] as const,
	details: () => [...fileKeys.all, 'detail'] as const,
	detail: (id: string) => [...fileKeys.details(), id] as const,
	byEntity: (entityType: string, entityId: string) => [...fileKeys.all, 'entity', entityType, entityId] as const,
}

export const useFiles = () => {
	return useQuery<File[], Error>({
		queryKey: fileKeys.list(),
		queryFn: fileApi.getFiles,
	})
}

export const useFile = (fileId: string) => {
	return useQuery<File, Error>({
		queryKey: fileKeys.detail(fileId),
		queryFn: () => fileApi.getFile(fileId),
		enabled: !!fileId,
	})
}

export const useFilesByEntity = (entityType: string, entityId: string) => {
	return useQuery<File[], Error>({
		queryKey: fileKeys.byEntity(entityType, entityId),
		queryFn: () => fileApi.getFilesByEntity(entityType, entityId),
		enabled: !!entityType && !!entityId,
	})
}

export const useCreateFile = () => {
	const queryClient = useQueryClient()

	return useMutation<File, Error, FileCreate>({
		mutationFn: fileApi.createFile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: fileKeys.lists() })
			toast.success(translate('fileCreatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToCreateFile'))
		},
	})
}

export const useUpdateFile = () => {
	const queryClient = useQueryClient()

	return useMutation<File, Error, { fileId: string; data: FileUpdate }>({
		mutationFn: ({ fileId, data }) => fileApi.updateFile(fileId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: fileKeys.lists() })
			queryClient.invalidateQueries({
				queryKey: fileKeys.detail(variables.fileId),
			})
			toast.success(translate('fileUpdatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToUpdateFile'))
		},
	})
}

export const useDeleteFile = () => {
	const queryClient = useQueryClient()

	return useMutation<void, Error, string>({
		mutationFn: fileApi.deleteFile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: fileKeys.lists() })
			toast.success(translate('fileDeletedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToDeleteFile'))
		},
	})
}
