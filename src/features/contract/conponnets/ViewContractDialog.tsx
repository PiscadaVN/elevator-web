import { useNavigate } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useContract } from '@/hooks/api'
import { useLanguage } from '@/i18n/LanguageContext'
import { formatCurrency } from '@/lib/currency-utils'
import { formatDisplayDate } from '@/lib/date-utils'

interface ViewContractDialogProps {
	contractId: string
}

export function ViewContractDialog({ contractId }: ViewContractDialogProps) {
	const navigate = useNavigate()
	const { t } = useLanguage()
	const { data: contract, isLoading } = useContract(contractId)

	return (
		<Dialog open={true} onOpenChange={(open) => !open && navigate({ to: '/contract' })}>
			<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t('contracts')}</DialogTitle>
					<DialogDescription>{t('contractManagementDesc')}</DialogDescription>
				</DialogHeader>

				{isLoading && (
					<div className="flex items-center justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
					</div>
				)}

				{contract && (
					<div className="space-y-4 py-2">
						{/* Customer */}
						<div>
							<p className="text-xs text-muted-foreground uppercase font-medium mb-2">{t('customer')}</p>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<p className="text-sm text-muted-foreground">{t('fullName')}</p>
									<p className="font-semibold">{contract.customer.fullName}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">{t('phone')}</p>
									<p className="font-semibold">{contract.customer.phone || '-'}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">{t('linkedElevators')}</p>
									<p className="font-semibold">{contract.elevators[0].code}</p>
								</div>
								<div>
									<p className="text-white">.</p>
									<p className="font-semibold">{contract.elevators[0]?.address}</p>
								</div>
							</div>
						</div>

						<hr className="border-border" />

						{/* Contract details */}
						<div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<p className="text-sm text-muted-foreground">{t('signDate')}</p>
									<p className="font-semibold">{formatDisplayDate(contract.signedAt)}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">{t('expiryDate')}</p>
									<p className="font-semibold">{formatDisplayDate(contract.expiredAt)}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">{t('amount')}</p>
									<p className="font-semibold">{formatCurrency(contract.contractValue)}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">{t('status')}</p>
									<Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
										{contract.status === 'active' ? t('contractActive') : t('contractExpired')}
									</Badge>
								</div>
							</div>
							{contract.description && (
								<div className="mt-3">
									<p className="text-sm text-muted-foreground">{t('note')}</p>
									<p className="font-semibold">{contract.description}</p>
								</div>
							)}
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
