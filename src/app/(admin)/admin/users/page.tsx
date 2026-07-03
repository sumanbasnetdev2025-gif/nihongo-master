import { UsersTable } from '@/features/admin-users/users-table'

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage student and admin accounts.</p>
      </div>
      <UsersTable />
    </div>
  )
}