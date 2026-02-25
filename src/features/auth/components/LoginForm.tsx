import { useState } from "react"
import type { FormEvent } from "react"
import { useAuth } from "../hooks/useAuth"
import { useLanguage } from "@/i18n/LanguageContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Building2 } from "lucide-react"

export function LoginForm() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("password")
  const [error, setError] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError("")
    if (!identifier || !password) {
      setError(t('loginError'))
      return
    }
    const success = login(identifier, password)
    if (!success) {
      setError(t('loginError'))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">{t('appName')}</CardTitle>
          <CardDescription>
            {t('loginDesc')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-center font-medium">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="identifier">{t('identifierLabel')}</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="identifier"
                  placeholder="admin@piscada.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('passwordLabel')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full h-11 text-lg font-semibold mt-4">
              {t('signInBtn')}
            </Button>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 italic">
              <p className="text-[10px] uppercase text-muted-foreground font-bold mb-2 tracking-wider text-center">{t('mockAccounts')}</p>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-center">
                <div className="p-1 border rounded bg-white">{t('admin')}: admin@piscada.com</div>
                <div className="p-1 border rounded bg-white">{t('operator')}: 0987654321</div>
                <div className="p-1 border rounded bg-white">{t('viewer')}: jane@piscada.com</div>
              </div>
            </div>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col">
          <p className="text-xs text-center text-muted-foreground mt-2">
            {t('copyright')}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
