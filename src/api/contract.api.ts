import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api-client'
import type { Contract, ContractCreate, ContractUpdate } from '@/types/api'

const toContractStatus = (expiredAt?: number | null): Contract['status'] => {
	const currentTime = Date.now() / 1000
	if (typeof expiredAt === 'number' && expiredAt > currentTime) {
		return 'active'
	}

	return 'expired'
}

const normalizeContract = (contract: Contract): Contract => {
	const status = toContractStatus(contract.expiredAt)

	return {
		...contract,
		status,
		isActive: status === 'active',
	}
}

const normalizeContracts = (contracts: Contract[]): Contract[] => {
	return contracts.map(normalizeContract)
}

export const contractApi = {
	getContracts: async (): Promise<Contract[]> => {
		const contracts = await apiGet<Contract[]>('contracts')
		return normalizeContracts(contracts)
	},

	createContract: async (data: ContractCreate): Promise<Contract> => {
		const contract = await apiPost<Contract>('contracts', data)
		return normalizeContract(contract)
	},

	getContract: async (contractId: string): Promise<Contract> => {
		const contract = await apiGet<Contract>(`contracts/${contractId}`)
		return normalizeContract(contract)
	},

	updateContract: async (contractId: string, data: ContractUpdate): Promise<Contract> => {
		const contract = await apiPut<Contract>(`contracts/${contractId}`, data)
		return normalizeContract(contract)
	},

	deleteContract: async (contractId: string): Promise<void> => {
		return apiDelete<void>(`contracts/${contractId}`)
	},

	getContractsByElevator: async (elevatorId: string): Promise<Contract[]> => {
		const contracts = await apiGet<Contract[]>(`contracts/elevator/${elevatorId}`)
		return normalizeContracts(contracts)
	},

	getContractsByCustomer: async (customerId: string): Promise<Contract[]> => {
		const contracts = await apiGet<Contract[]>(`contracts/customer/${customerId}`)
		return normalizeContracts(contracts)
	},
}
