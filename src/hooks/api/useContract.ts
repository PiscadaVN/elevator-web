import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { contractApi } from '@/api/contract.api'
import { translate } from '@/i18n/LanguageContext'
import type { Contract, ContractCreate, ContractUpdate } from '@/types/api'

export const contractKeys = {
	all: ['contracts'] as const,
	lists: () => [...contractKeys.all, 'list'] as const,
	list: () => [...contractKeys.lists()] as const,
	details: () => [...contractKeys.all, 'detail'] as const,
	detail: (id: string) => [...contractKeys.details(), id] as const,
	byElevator: (elevatorId: string) => [...contractKeys.all, 'elevator', elevatorId] as const,
	byCustomer: (customerId: string) => [...contractKeys.all, 'customer', customerId] as const,
}

export const useContracts = () => {
	return useQuery<Contract[], Error>({
		queryKey: contractKeys.list(),
		queryFn: contractApi.getContracts,
	})
}

export const useContract = (contractId: string) => {
	return useQuery<Contract, Error>({
		queryKey: contractKeys.detail(contractId),
		queryFn: () => contractApi.getContract(contractId),
		enabled: !!contractId,
	})
}

export const useContractsByElevator = (elevatorId: string) => {
	return useQuery<Contract[], Error>({
		queryKey: contractKeys.byElevator(elevatorId),
		queryFn: () => contractApi.getContractsByElevator(elevatorId),
		enabled: !!elevatorId,
	})
}

export const useContractsByCustomer = (customerId: string) => {
	return useQuery<Contract[], Error>({
		queryKey: contractKeys.byCustomer(customerId),
		queryFn: () => contractApi.getContractsByCustomer(customerId),
		enabled: !!customerId,
	})
}

export const useCreateContract = () => {
	const queryClient = useQueryClient()

	return useMutation<Contract, Error, ContractCreate>({
		mutationFn: contractApi.createContract,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: contractKeys.lists() })
			toast.success(translate('contractCreatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToCreateContract'))
		},
	})
}

export const useUpdateContract = () => {
	const queryClient = useQueryClient()

	return useMutation<Contract, Error, { contractId: string; data: ContractUpdate }>({
		mutationFn: ({ contractId, data }) => contractApi.updateContract(contractId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: contractKeys.lists() })
			queryClient.invalidateQueries({
				queryKey: contractKeys.detail(variables.contractId),
			})
			toast.success(translate('contractUpdatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToUpdateContract'))
		},
	})
}

export const useDeleteContract = () => {
	const queryClient = useQueryClient()

	return useMutation<void, Error, string>({
		mutationFn: contractApi.deleteContract,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: contractKeys.lists() })
			toast.success(translate('contractDeletedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToDeleteContract'))
		},
	})
}
