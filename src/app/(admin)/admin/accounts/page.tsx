'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, KeyRound, Trash2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import ChangePasswordModal from '@/components/admin/ChangePasswordModal';
import CreateAdminModal from '@/components/admin/CreateAdminModal';

interface Account {
  id: string;
  studentId: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
  createdAt: string;
  hasEncryptedPassword?: boolean;
}

export default function AdminAccountsPage() {
  const [students, setStudents] = useState<Account[]>([]);
  const [admins, setAdmins] = useState<Account[]>([]);
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete admin state
  const [adminToDelete, setAdminToDelete] = useState<Account | null>(null);
  const [deleteAdminError, setDeleteAdminError] = useState<string | null>(null);
  const [deleteAdminSuccess, setDeleteAdminSuccess] = useState<string | null>(null);
  const [isDeletingAdmin, setIsDeletingAdmin] = useState(false);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/accounts');
      if (!res.ok) throw new Error('Failed to fetch accounts');
      const data = await res.json();
      setStudents(data.students || []);
      setAdmins(data.admins || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePasswordClick = (account: Account) => {
    setSelectedAccount(account);
    setIsChangePasswordModalOpen(true);
  };

  const handleAdminCreated = () => {
    fetchAccounts();
    setIsCreateAdminModalOpen(false);
  };

  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, string>>({});
  const [isRevealing, setIsRevealing] = useState<Record<string, boolean>>({});

  const togglePasswordReveal = async (account: Account) => {
    // If already revealed, hide it
    if (revealedPasswords[account.id]) {
      setRevealedPasswords(prev => {
        const next = { ...prev };
        delete next[account.id];
        return next;
      });
      return;
    }

    // Otherwise, fetch it
    setIsRevealing(prev => ({ ...prev, [account.id]: true }));
    try {
      const res = await fetch(`/api/admin/accounts/${account.id}/password`);
      if (!res.ok) {
        throw new Error('Failed to reveal password');
      }
      const data = await res.json();
      setRevealedPasswords(prev => ({ ...prev, [account.id]: data.password }));
    } catch (err: any) {
      console.error(err);
      // Fallback or alert if needed
      alert('Could not reveal password. It may not be set.');
    } finally {
      setIsRevealing(prev => ({ ...prev, [account.id]: false }));
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;

    setIsDeletingAdmin(true);
    setDeleteAdminError(null);
    setDeleteAdminSuccess(null);

    try {
      const res = await fetch(`/api/admin/accounts/${adminToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to delete admin');

      setDeleteAdminSuccess(`Admin ${adminToDelete.name} deleted successfully.`);
      setAdminToDelete(null);
      fetchAccounts(); // Refresh list
    } catch (err: any) {
      console.error(err);
      setDeleteAdminError(err.message);
    } finally {
      setIsDeletingAdmin(false);
    }
  };

  const renderTable = (accounts: Account[], type: 'STUDENT' | 'ADMIN') => {
    if (accounts.length === 0) {
      return (
        <div className="bg-[#151b2b] rounded-2xl border border-white/10 p-12 text-center">
          <p className="text-slate-400">No {type.toLowerCase()} accounts found.</p>
        </div>
      );
    }

    return (
      <div className="bg-[#151b2b] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-4 px-6 text-xs font-semibold text-slate-300 uppercase tracking-wider w-[20%]">
                  {type === 'STUDENT' ? 'Student ID' : 'Admin ID'}
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-300 uppercase tracking-wider w-[25%]">Name</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-300 uppercase tracking-wider w-[30%]">Password</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-300 uppercase tracking-wider w-[10%]">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-300 uppercase tracking-wider w-[15%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {accounts.map((account) => {
                const isRevealed = !!revealedPasswords[account.id];
                const actualPassword = revealedPasswords[account.id];
                const loading = isRevealing[account.id];

                return (
                  <tr key={account.id} className="group transition-colors hover:bg-white/[0.02]">
                    <td className="py-4 px-6 text-sm text-slate-300 font-medium">
                      {account.studentId}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-100">
                      <div className="flex items-center gap-2">
                        {account.name}
                        {type === 'ADMIN' && (
                          <button
                            onClick={() => {
                              setDeleteAdminError(null);
                              setDeleteAdminSuccess(null);
                              setAdminToDelete(account);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete Admin"
                            aria-label={`Delete Admin ${account.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {account.hasEncryptedPassword ? (
                        <div className="flex items-center gap-4">
                          <span className={`text-slate-200 select-all ${!isRevealed ? 'tracking-[0.2em] font-sans text-lg' : 'font-mono'}`}>
                            {isRevealed ? actualPassword : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordReveal(account)}
                            disabled={loading}
                            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
                            title={isRevealed ? "Hide Password" : "Show Password"}
                          >
                            {loading ? (
                              <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                            ) : isRevealed ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 italic text-[13px]">Password not available</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleChangePasswordClick(account)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors text-sm font-medium border border-transparent hover:border-blue-500/20 whitespace-nowrap"
                      >
                        <KeyRound className="w-4 h-4" />
                        {account.hasEncryptedPassword ? 'Change' : 'Set Password'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#0f1423] text-slate-200">
      <AdminSidebar
        user={null}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen relative min-w-0">
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#151b2b] border-b border-white/10 sticky top-0 z-30">
          <h1 className="text-xl font-bold text-white">Account Management</h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <main className="flex-1 p-6 lg:py-10 lg:px-10 xl:px-12 space-y-6 w-full max-w-[90%] 2xl:max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-blue-500" />
                Account Management
              </h1>
              <p className="text-slate-400">Manage credentials for students and administrators.</p>
            </div>
            
            {activeTab === 'ADMIN' && (
              <button
                onClick={() => setIsCreateAdminModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#2546a8] text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-900/20 w-fit"
              >
                <Plus className="w-4 h-4" />
                Add Admin
              </button>
            )}
          </div>

          <div className="flex gap-2 border-b border-white/10 mt-8">
            <button
              onClick={() => setActiveTab('STUDENT')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'STUDENT'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              Student Accounts
            </button>
            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'ADMIN'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              Admin Accounts
            </button>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          {deleteAdminSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm">
              {deleteAdminSuccess}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-[#1E3A8A]/30 border-t-[#1E3A8A] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="mt-6">
              {activeTab === 'STUDENT' ? renderTable(students, 'STUDENT') : renderTable(admins, 'ADMIN')}
            </div>
          )}
        </main>
      </div>

      {isChangePasswordModalOpen && selectedAccount && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          account={selectedAccount}
          onSuccess={() => {
            setIsChangePasswordModalOpen(false);
          }}
        />
      )}

      {isCreateAdminModalOpen && (
        <CreateAdminModal
          isOpen={isCreateAdminModalOpen}
          onClose={() => setIsCreateAdminModalOpen(false)}
          onSuccess={handleAdminCreated}
        />
      )}

      {/* ── Delete Admin Confirmation Modal ─────────────────────────────── */}
      {adminToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => { if (!isDeletingAdmin) { setAdminToDelete(null); setDeleteAdminError(null); } }} 
          />
          <div className="relative bg-[#151b2b] rounded-2xl shadow-2xl w-full max-w-md border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Delete Admin?
              </h3>
              
              <div className="p-3 bg-white/5 rounded-lg mb-4 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="font-semibold text-slate-200">{adminToDelete.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ID:</span>
                  <span className="font-semibold text-slate-200">{adminToDelete.studentId}</span>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-6">
                Are you sure you want to delete <strong>{adminToDelete.name}</strong>? This action cannot be undone.
              </p>

              {deleteAdminError && (
                <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-2 text-rose-400 text-sm">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{deleteAdminError}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setAdminToDelete(null); setDeleteAdminError(null); }}
                  disabled={isDeletingAdmin}
                  className="flex-1 px-4 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAdmin}
                  disabled={isDeletingAdmin}
                  className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeletingAdmin ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Admin
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
