import React, { createContext, useContext, useMemo, useState } from "react";
import type { User } from "@/types";

interface AuthContextType {
	user: User | null;
	login: (identifier: string, password?: string) => boolean;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: User[] = [
	{
		id: "U01",
		name: "Admin User",
		email: "admin@piscada.com",
		phone: "0123456789",
		password: "password",
		role: "admin",
		status: "active",
	},
	{
		id: "U02",
		name: "Operator John",
		email: "john@piscada.com",
		phone: "0987654321",
		password: "password",
		role: "operator",
		status: "active",
	},
	{
		id: "U03",
		name: "Viewer Jane",
		email: "jane@piscada.com",
		phone: "0112233445",
		password: "password",
		role: "viewer",
		status: "active",
	},
];

function getInitialUser(): User | null {
	const storedUsers = localStorage.getItem("elevator_users_db");
	if (!storedUsers) {
		localStorage.setItem("elevator_users_db", JSON.stringify(MOCK_USERS));
	}

	const savedUser = localStorage.getItem("elevator_user");
	if (savedUser) {
		try {
			return JSON.parse(savedUser);
		} catch {
			localStorage.removeItem("elevator_user");
		}
	}
	return null;
}

export function AuthProvider({children}: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(getInitialUser);
	const isLoading = false;

	const login = (identifier: string, password?: string) => {
		const users: User[] = JSON.parse(
			localStorage.getItem("elevator_users_db") || "[]",
		);
		const foundUser = users.find(
			(u) =>
				(u.email === identifier || u.phone === identifier) &&
				u.status === "active" &&
				(!u.password || u.password === password),
		);

		if (foundUser) {
			setUser(foundUser);
			localStorage.setItem("elevator_user", JSON.stringify(foundUser));
			return true;
		}
		return false;
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("elevator_user");
	};

	const value = useMemo(
		() => ({user, login, logout, isLoading}),
		[user, isLoading],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
