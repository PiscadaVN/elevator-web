import { Edit, Mail, Phone, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLanguage } from '@/i18n/LanguageContext'
import { UserRoles } from '@/lib/role-utils'
import type { User } from '@/types/api'

interface UserTableProps {
	users: User[]
	isLoading: boolean
	onEdit: (user: User) => void
	onToggleStatus: (id: string) => void
}

export function UserTable({ users, isLoading, onEdit, onToggleStatus }: UserTableProps) {
	const { t } = useLanguage()

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('registeredUsers')}</CardTitle>
				<CardDescription>{t('accountsInSystem')}</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">{t('loadingUsers')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('fullName')}</TableHead>
								<TableHead>{t('contact')}</TableHead>
								<TableHead>{t('role')}</TableHead>
								<TableHead>{t('status')}</TableHead>
								<TableHead className="text-right">{t('actions')}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((u) => (
								<TableRow key={u.id} className={u.isActive ? '' : 'opacity-50'}>
									<TableCell>
										<div className="font-bold">{u.fullName}</div>
									</TableCell>
									<TableCell>
										{u.role === UserRoles.USER ? (
											<div className="flex items-center gap-2 text-xs mt-1">
												<Phone className="w-3 h-3" /> {u.phone || '-'}
											</div>
										) : (
											<div className="flex items-center gap-2 text-xs">
												<Mail className="w-3 h-3" /> {u.email || '-'}
											</div>
										)}
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="capitalize">
											{(() => {
												if (u.role === UserRoles.ADMIN) return t('admin')
												if (u.role === UserRoles.OPERATOR) return t('operator')
												return t('user')
											})()}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge variant={u.isActive ? 'success' : 'secondary'} className="capitalize">
											{u.isActive ? t('active') : t('disabled')}
										</Badge>
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Button variant="ghost" size="icon" onClick={() => onEdit(u)}>
											<Edit className="w-4 h-4 text-blue-600" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => onToggleStatus(u.id)}
											title={u.isActive ? t('disableUser') : t('enableUser')}
										>
											<Trash2 className={`w-4 h-4 ${u.isActive ? 'text-red-600' : 'text-green-600'}`} />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	)
}
