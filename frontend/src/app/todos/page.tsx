"use client";

/**
 * Todos page
 * Main todo list page (protected route)
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { Plus, ClipboardList, LayoutDashboard, Search, Filter, RefreshCw, CheckCircle2, AlertTriangle, ListTodo, BarChart3, Sparkles, Edit3, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Todo, listTodos, createTodo, updateTodo, deleteTodo, Priority } from "@/lib/api/todos";
import { ArrowUpDown } from "lucide-react";
import TodoItem from "@/components/todos/TodoItem";
import TaskModal from "@/components/todos/TaskModal";
import ChatInterface from "@/components/chat/ChatInterface";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AgentCommandsModal from "@/components/ui/AgentCommandsModal";

export default function TodosPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Sync State
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("synced");
  const [lastSynced, setLastSynced] = useState<Date>(new Date());

  // Search & Filter State
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"created_at" | "due_date" | "priority">("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Delete Confirmation State
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Agent Commands Modal State
  const [isAgentCommandsOpen, setIsAgentCommandsOpen] = useState(false);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Fetch todos on mount and filter change
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        fetchTodos();
      }, 300); // Debounce search
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, searchQuery, filterPriority, sortBy, order]);

  // Sync on window focus
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        fetchTodos(true); // silent fetch
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isAuthenticated]);

  const fetchTodos = async (silent = false) => {
    if (!silent) setIsDataLoading(true);
    setSyncStatus("syncing");
    try {
      const data = await listTodos({
        priority: filterPriority === "all" ? undefined : filterPriority,
        search: searchQuery || undefined,
        sort_by: sortBy,
        order: order
      });
      setTodos(data);
      setSyncStatus("synced");
      setLastSynced(new Date());
    } catch (err: any) {
      setSyncStatus("error");
      if (!silent) toast.error(err.userMessage || "Failed to load tasks");
    } finally {
      if (!silent) setIsDataLoading(false);
    }
  };

  const handleSaveTask = async (data: any) => {
    setIsActionLoading(true);
    setSyncStatus("syncing");
    try {
      if (editingTodo) {
        const updated = await updateTodo(editingTodo.id, data);
        setTodos(todos.map(t => t.id === updated.id ? updated : t));
        toast.success("Task updated successfully");
      } else {
        const newTodo = await createTodo(data);
        setTodos([newTodo, ...todos]);
        toast.success("Task created successfully");
      }
      setSyncStatus("synced");
      setLastSynced(new Date());
      setIsModalOpen(false);
    } catch (err: any) {
      setSyncStatus("error");
      toast.error(err.userMessage || "Failed to save task");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    setSyncStatus("syncing");
    try {
      const updated = await updateTodo(id, { completed });
      setTodos(todos.map(t => t.id === id ? updated : t));
      setSyncStatus("synced");
      setLastSynced(new Date());
    } catch (err: any) {
      setSyncStatus("error");
      toast.error(err.userMessage || "Failed to update task");
    }
  };

  const handleDeleteRequest = (id: string) => {
    setTodoToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!todoToDelete) return;

    setIsDeleting(true);
    setSyncStatus("syncing");
    try {
      await deleteTodo(todoToDelete);
      setTodos(todos.filter(t => t.id !== todoToDelete));
      toast.success("Task deleted");
      setSyncStatus("synced");
      setLastSynced(new Date());
      setIsDeleteConfirmOpen(false);
    } catch (err: any) {
      setSyncStatus("error");
      toast.error(err.userMessage || "Failed to delete task");
    } finally {
      setIsDeleting(false);
      setTodoToDelete(null);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  // Filtering Logic
  // Client-side filtering for Category only (as API doesn't support it yet)
  const filteredTodos = todos.filter(todo => {
    const matchesCategory = filterCategory === "all" || todo.category === filterCategory;
    return matchesCategory;
  });

  const categories = Array.from(new Set(todos.map(t => t.category || "General")));

  // Stats Logic
  const pendingCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;
  const highPriorityCount = todos.filter(t => t.priority === "HIGH" && !t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  // Show loading spinner while checking auth or loading data initially
  if (isAuthLoading || (isAuthenticated && isDataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-slate-400 font-medium animate-pulse">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
              <LayoutDashboard className="w-4 h-4" />
              Productivity Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight break-words max-w-[90vw] md:max-w-none">
              Welcome, <span className="text-indigo-600 block sm:inline">{user?.email.split('@')[0]}</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">You have {pendingCount} pending tasks today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsAgentCommandsOpen(true)}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 h-12 px-4 hover:from-indigo-100 hover:to-purple-100"
              title="View AI Commands"
            >
              <Sparkles className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="hidden sm:inline font-semibold text-indigo-700">Commands</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => fetchTodos()}
              className="bg-white border-slate-200 h-12 w-12 p-0 flex items-center justify-center hover:bg-slate-50"
              title="Manual Sync"
            >
              <RefreshCw className={cn("w-5 h-5 text-slate-500", syncStatus === "syncing" && "animate-spin")} />
            </Button>
            <Button
              onClick={handleAddNew}
              className="shadow-xl shadow-indigo-200 group h-12 px-4 sm:px-6"
            >
              <Plus className="w-5 h-5 sm:mr-2 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline">Create New Task</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="sm:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Total Progress</span>
              <span className="text-indigo-600 font-black text-xl">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-rose-600">{highPriorityCount}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">High Priority</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600">{completedCount}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border-none text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1 border border-slate-100">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-sm font-bold text-slate-600 outline-none pl-3"
                >
                  <option value="created_at">Created</option>
                  <option value="due_date">Due Date</option>
                  <option value="priority">Priority</option>
                </select>
                <button
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  className="p-2 hover:bg-white rounded-xl transition-all shadow-sm"
                >
                  <ArrowUpDown className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                  showFilters ? "bg-indigo-600 text-white" : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
                )}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-4 border-t border-slate-50">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Priority</label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value as any)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 border-none text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="all">All Priorities</option>
                      <option value="HIGH">High Only</option>
                      <option value="MEDIUM">Medium Only</option>
                      <option value="LOW">Low Only</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Category</label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 border-none text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilterPriority("all");
                        setFilterCategory("all");
                        setSearchQuery("");
                      }}
                      className="w-full px-4 py-2 rounded-xl text-indigo-600 font-bold text-xs uppercase hover:bg-indigo-50 transition-all text-center"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* List Content */}
        {filteredTodos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 md:p-24 text-center"
          >
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3">
              <ClipboardList className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {searchQuery || filterPriority !== "all" || filterCategory !== "all" ? "No matching tasks" : "Your slate is clean"}
            </h2>
            <p className="text-slate-500 max-w-xs mx-auto mb-10">
              {searchQuery || filterPriority !== "all" || filterCategory !== "all"
                ? "Try adjusting your filters or search query to find what you're looking for."
                : "No tasks found. Click the button above to start building your productive day."}
            </p>
            {(searchQuery || filterPriority !== "all" || filterCategory !== "all") ? (
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setFilterPriority("all");
                setFilterCategory("all");
              }} className="border-slate-200">
                Reset Filters
              </Button>
            ) : (
              <Button variant="outline" onClick={handleAddNew} className="border-slate-200">
                Create your first task
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteRequest}
                  onEdit={handleEditTodo}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTodo}
        isLoading={isActionLoading}
      />

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete Task"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Footer System Status */}
      <div className="max-w-5xl mx-auto w-full px-4 mb-12">
        <div className="bg-white/50 backdrop-blur-sm border border-slate-100 rounded-2xl px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-500",
              syncStatus === "syncing" ? "bg-amber-400 animate-pulse" :
                syncStatus === "error" ? "bg-rose-500" : "bg-emerald-500"
            )} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {syncStatus === "syncing" ? "Syncing Workspace..." :
                  syncStatus === "error" ? "Cloud Sync Offline" : "Workspace Synced"}
              </span>
              <span className="text-[8px] text-slate-400 font-bold uppercase">
                Last Update: {lastSynced.toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <ListTodo className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{todos.length} Items</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">v1.3.0-PREMIUM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Commands Modal */}
      <AgentCommandsModal
        isOpen={isAgentCommandsOpen}
        onClose={() => setIsAgentCommandsOpen(false)}
      />

      <ChatInterface />
    </div>
  );
}
