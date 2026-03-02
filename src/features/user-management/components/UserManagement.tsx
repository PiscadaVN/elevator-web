import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, UserPlus, Trash2, Edit, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { User, UserRole } from "@/types";

export function UserManagement() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem("elevator_users_db");
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch {
      return [];
    }
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    phone: "",
    role: "viewer",
    password: "password",
    status: "active",
  });

  const saveToDb = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem("elevator_users_db", JSON.stringify(newUsers));
  };

  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.phone) return;

    // Simple email/phone uniqueness check
    if (
      users.some(
        (u) => u.email === formData.email || u.phone === formData.phone,
      )
    ) {
      alert("Email or Phone number already exists.");
      return;
    }

    const newUser: User = {
      id: `U0${users.length + 1}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role as User["role"],
      password: formData.password || "password",
      status: "active",
    };

    saveToDb([...users, newUser]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    const updatedUsers = users.map((u) =>
      u.id === editingUser.id ? ({ ...u, ...formData } as User) : u,
    );
    saveToDb(updatedUsers);
    setEditingUser(null);
    resetForm();
  };

  const handleToggleStatus = (id: string) => {
    const updatedUsers = users.map((u) =>
      u.id === id
        ? ({
            ...u,
            status: u.status === "active" ? "disabled" : "active",
          } as User)
        : u,
    );
    saveToDb(updatedUsers);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "viewer",
      password: "password",
      status: "active",
    });
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: user.password,
      status: user.status,
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Users className="w-10 h-10 text-primary" />
            {t("userManagementTitle")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("userManagementDesc")}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg hover:shadow-primary/20 transition-all">
              <UserPlus className="w-4 h-4 mr-2" /> {t("addUser")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("addUser")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>{t("fullName")}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("email")}</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("phone")}</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="0xxx"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("role")}</Label>
                <Select
                  value={formData.role}
                  onValueChange={(v) =>
                    setFormData({ ...formData, role: v as UserRole })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">
                      {t("super_admin")}
                    </SelectItem>
                    <SelectItem value="admin">{t("admin")}</SelectItem>
                    <SelectItem value="operator">{t("operator")}</SelectItem>
                    <SelectItem value="viewer">{t("viewer")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddUser}>{t("confirm")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{t("registeredUsers")}</CardTitle>
          <CardDescription>{t("accountsInSystem")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("fullName")}</TableHead>
                <TableHead>
                  {t("email")}/{t("phone")}
                </TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow
                  key={u.id}
                  className={u.status === "disabled" ? "opacity-50" : ""}
                >
                  <TableCell>
                    <div className="font-bold">{u.name}</div>
                    <div className="text-xs text-muted-foreground uppercase">
                      {u.id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs">
                      <Mail className="w-3 h-3" /> {u.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <Phone className="w-3 h-3" /> {u.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {(() => {
                        if (u.role === "super_admin") return t("super_admin");
                        if (u.role === "admin") return t("admin");
                        if (u.role === "operator") return t("operator");
                        return t("viewer");
                      })()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={u.status === "active" ? "success" : "secondary"}
                      className="capitalize"
                    >
                      {u.status === "active" ? t("active") : t("disabled")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(u)}
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(u.id)}
                      title={
                        u.status === "active"
                          ? t("disableUser")
                          : t("enableUser")
                      }
                    >
                      <Trash2
                        className={`w-4 h-4 ${u.status === "active" ? "text-red-600" : "text-green-600"}`}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("edit")}: {editingUser?.name}
            </DialogTitle>
            <DialogDescription>{t("userManagementDesc")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>{t("fullName")}</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("email")}</Label>
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("phone")}</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("role")}</Label>
              <Select
                value={formData.role}
                onValueChange={(v) =>
                  setFormData({ ...formData, role: v as UserRole })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">
                    {t("super_admin")}
                  </SelectItem>
                  <SelectItem value="admin">{t("admin")}</SelectItem>
                  <SelectItem value="operator">{t("operator")}</SelectItem>
                  <SelectItem value="viewer">{t("viewer")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateUser}>{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
