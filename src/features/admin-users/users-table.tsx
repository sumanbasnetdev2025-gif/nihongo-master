"use client";

import { useEffect, useState } from "react";
import { Search, Shield, ShieldOff, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { getAllUsers, updateUserRole, getUserStats } from "./actions";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil } from "lucide-react";
import { EditUserDialog } from "./edit-user-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statsMap, setStatsMap] = useState<
    Record<string, { totalTests: number; accuracy: number }>
  >({});
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    name: string;
    newRole: "student" | "admin";
  } | null>(null);
  const [editingUser, setEditingUser] = useState<{
    id: string;
    full_name: string | null;
  } | null>(null);

  const loadUsers = async (searchTerm?: string) => {
    setLoading(true);
    try {
      const data = await getAllUsers(searchTerm);
      setUsers(data);

      // Fetch stats for each user (fine at small scale; would paginate/batch at larger scale)
      const stats: Record<string, { totalTests: number; accuracy: number }> =
        {};
      await Promise.all(
        data.map(async (u) => {
          stats[u.id] = await getUserStats(u.id);
        }),
      );
      setStatsMap(stats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => loadUsers(search || undefined), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleRoleToggle = (user: any) => {
    const newRole = user.role === "admin" ? "student" : "admin";
    setConfirmTarget({
      id: user.id,
      name: user.full_name ?? "this user",
      newRole,
    });
  };

  const confirmRoleChange = async () => {
    if (!confirmTarget) return;
    try {
      await updateUserRole(confirmTarget.id, confirmTarget.newRole);
      toast.success(
        `${confirmTarget.name} is now ${confirmTarget.newRole === "admin" ? "an admin" : "a student"}`,
      );
      loadUsers(search || undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setConfirmTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          No users found.
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden overflow-x-auto rounded-lg border sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Tests Taken</TableHead>
                  <TableHead className="hidden sm:table-cell">Accuracy</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const initials = user.full_name
                    ? user.full_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "U";
                  const stats = statsMap[user.id];

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            {user.avatar_url && (
                              <AvatarImage src={user.avatar_url} />
                            )}
                            <AvatarFallback className="text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {user.full_name ?? "Unnamed User"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                          className={user.role === "admin" ? "bg-blue-500 hover:bg-blue-600" : ""}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {stats?.totalTests ?? "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {stats ? `${stats.accuracy}%` : "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingUser(user)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRoleToggle(user)}
                            className="hidden sm:flex"
                          >
                            {user.role === "admin" ? (
                              <>
                                <ShieldOff className="mr-1.5 h-3.5 w-3.5" />
                                Demote
                              </>
                            ) : (
                              <>
                                <Shield className="mr-1.5 h-3.5 w-3.5" />
                                Make Admin
                              </>
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild className="sm:hidden">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingUser(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRoleToggle(user)}>
                                {user.role === "admin" ? (
                                  <>
                                    <ShieldOff className="mr-2 h-4 w-4" />
                                    Demote to Student
                                  </>
                                ) : (
                                  <>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Make Admin
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View - Visible only on mobile */}
          <div className="space-y-3 sm:hidden">
            {users.map((user) => {
              const initials = user.full_name
                ? user.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "U";
              const stats = statsMap[user.id];

              return (
                <Card key={user.id} className="border">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {user.avatar_url && (
                            <AvatarImage src={user.avatar_url} />
                          )}
                          <AvatarFallback className="text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.full_name ?? "Unnamed User"}
                          </p>
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "secondary"
                            }
                            className={`mt-1 ${user.role === "admin" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                          >
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingUser(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleToggle(user)}>
                            {user.role === "admin" ? (
                              <>
                                <ShieldOff className="mr-2 h-4 w-4" />
                                Demote to Student
                              </>
                            ) : (
                              <>
                                <Shield className="mr-2 h-4 w-4" />
                                Make Admin
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Tests Taken</p>
                        <p className="font-medium">{stats?.totalTests ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                        <p className="font-medium">{stats ? `${stats.accuracy}%` : "—"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground">Joined</p>
                        <p className="text-sm">{formatDate(user.created_at)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <AlertDialog
        open={!!confirmTarget}
        onOpenChange={(o) => !o && setConfirmTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmTarget?.newRole === "admin"
                ? "Grant admin access?"
                : "Remove admin access?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmTarget?.newRole === "admin"
                ? `${confirmTarget?.name} will be able to manage chapters, questions, and other users.`
                : `${confirmTarget?.name} will lose access to the admin panel.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(o) => !o && setEditingUser(null)}
        onUpdated={() => loadUsers(search || undefined)}
      />
    </div>
  );
}