import { Edit, Mail, Phone, Trash2 } from 'lucide-react'

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

function getRoleLabelAndClass(role: (typeof UserRoles)[keyof typeof UserRoles], t: (key: string) => string) {
	switch (role) {
		case UserRoles.ADMIN:
			return { label: t('admin'), className: 'bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]' }
		case UserRoles.OPERATOR:
			return { label: t('operator'), className: 'bg-[#e0f7fa] text-[#00796b] border-[#b2dfdb]' }
		default:
			return { label: t('user'), className: 'bg-[#f3e5f5] text-[#6a1b9a] border-[#e1bee7]' }
	}
}

export function UserTable({ users, isLoading, onEdit, onToggleStatus }: Readonly<UserTableProps>) {
	const { t } = useLanguage()

	return (
		<Card className="rounded-2xl overflow-hidden border">
			<CardHeader className="p-4.5 px-5.5 pb-3.5 border-b border-border/50 bg-card">
				<CardTitle className="text-[15px] font-bold text-foreground">{t('registeredUsers')}</CardTitle>
				<CardDescription className="text-[12px] font-medium text-muted-foreground mt-0.5">
					{t('accountsInSystem')}
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">{t('loadingUsers')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/50 hover:bg-muted/50">
								<TableHead className="py-2.5 px-4 text-[11px] font-bold text-muted-foreground tracking-[0.5px] uppercase whitespace-nowrap">
									{t('fullName')}
								</TableHead>
								<TableHead className="py-2.5 px-4 text-[11px] font-bold text-muted-foreground tracking-[0.5px] uppercase whitespace-nowrap">
									{t('contact')}
								</TableHead>
								<TableHead className="py-2.5 px-4 text-[11px] font-bold text-muted-foreground tracking-[0.5px] uppercase whitespace-nowrap">
									{t('role')}
								</TableHead>
								<TableHead className="py-2.5 px-4 text-[11px] font-bold text-muted-foreground tracking-[0.5px] uppercase whitespace-nowrap">
									{t('status')}
								</TableHead>
								<TableHead className="py-2.5 px-4 text-[11px] font-bold text-muted-foreground tracking-[0.5px] uppercase whitespace-nowrap text-right">
									{t('actions')}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((u, i) => {
								const avatarColors = [
									'bg-orange-500',
									'bg-blue-500',
									'bg-purple-500',
									'bg-emerald-500',
									'bg-pink-500',
									'bg-cyan-500',
									'bg-amber-500',
									'bg-indigo-500',
									'bg-teal-500',
								]
								const initials = u.fullName
									.split(' ')
									.map((w) => w[0])
									.join('')
									.slice(0, 2)
									.toUpperCase()

								return (
									<TableRow
										key={u.id}
										className={
											u.isActive
												? 'hover:bg-[#fafafa] transition-colors duration-150'
												: 'opacity-70 hover:bg-[#fafafa] transition-colors duration-150'
										}
									>
										<TableCell className="font-bold text-[13px] text-foreground border-b border-border/50">
											<div className="flex items-center gap-2.5">
												<div
													className={`w-8.5 h-8.5 rounded-full flex items-center justify-center text-[12px] font-extrabold text-white shrink-0 ${avatarColors[i % avatarColors.length]}`}
												>
													{initials}
												</div>
												<div>
													<div className="font-bold text-foreground text-[13px]">{u.fullName}</div>
													<div className="text-[11px] text-muted-foreground font-medium mt-px">
														{getRoleLabelAndClass(u.role, t).label}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell className="border-b border-border/50">
											{u.role === UserRoles.ADMIN ? (
												<div className="flex items-center gap-1.5 text-[12px] text-muted-foreground font-medium">
													<Mail className="w-3.25 h-3.25 shrink-0" /> {u.email || '-'}
												</div>
											) : (
												<div className="flex items-center gap-1.5 text-[12px] text-muted-foreground font-medium">
													<Phone className="w-3.25 h-3.25 shrink-0" /> {u.phone || '-'}
												</div>
											)}
										</TableCell>
										<TableCell className="border-b border-border/50">
											<span
												className={`inline-flex items-center gap-1.25 px-2.75 py-1 rounded-1.75 text-[11px] font-bold whitespace-nowrap ${getRoleLabelAndClass(u.role, t).className}`}
											>
												{getRoleLabelAndClass(u.role, t).label}
											</span>
										</TableCell>
										<TableCell className="border-b border-border/50">
											<span
												className={`inline-flex items-center gap-1.25 px-3 py-1 rounded-5 text-[11px] font-extrabold whitespace-nowrap ${u.isActive ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]' : 'bg-muted text-muted-foreground border'}`}
											>
												<span
													className={`w-1.75 h-1.75 rounded-full ${u.isActive ? 'bg-[#10b981]' : 'bg-muted-foreground'}`}
												></span>
												{u.isActive ? t('active') : t('disabled')}
											</span>
										</TableCell>
										<TableCell className="border-b border-border/50">
											<div className="flex gap-1.5 justify-end">
												<Button
													variant="outline"
													size="icon"
													className="w-7.5 h-7.5 rounded-1.75 border bg-card flex items-center justify-center text-muted-foreground hover:bg-[#eff6ff] hover:text-[#2563eb] hover:border-[#bfdbfe] transition-all cursor-pointer"
													onClick={() => onEdit(u)}
												>
													<Edit className="w-3.25 h-3.25" />
												</Button>
												<Button
													variant="outline"
													size="icon"
													className="w-7.5 h-7.5 rounded-1.75 border bg-card flex items-center justify-center text-muted-foreground hover:bg-[#fef2f2] hover:text-[#ef4444] hover:border-[#fecaca] transition-all cursor-pointer"
													onClick={() => onToggleStatus(u.id)}
													title={u.isActive ? t('disableUser') : t('enableUser')}
												>
													<Trash2 className="w-3.25 h-3.25" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	)
}
