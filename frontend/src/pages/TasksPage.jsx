import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAtlas } from '../context/AtlasContext';
import { taskAPI } from '../services/api';

const CATEGORIES = [
  { value: 'research', label: 'General Research', icon: 'science' },
  { value: 'economic_analysis', label: 'Economic Analysis', icon: 'trending_up' },
  { value: 'demographic_study', label: 'Demographic Study', icon: 'groups' },
  { value: 'field_trip', label: 'Field Expedition', icon: 'explore' },
  { value: 'general', label: 'General', icon: 'task' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'high', label: 'High', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800 border-red-300' },
];

export default function TasksPage() {
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();
  const { countries, showToast } = useAtlas();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modal State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [countryId, setCountryId] = useState('japan');
  const [category, setCategory] = useState('research');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch tasks from API
  const loadTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (search.trim()) params.search = search.trim();

      const res = await taskAPI.getAll(params);
      if (res.success) {
        setTasks(res.tasks);
      }
    } catch (err) {
      showToast('Could not load research tasks');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, statusFilter, priorityFilter, search, showToast]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  function openCreateModal() {
    setEditingTaskId(null);
    setTitle('');
    setDescription('');
    setCountryId('japan');
    setCategory('research');
    setPriority('medium');
    setStatus('pending');
    setDueDate('');
    setModalOpen(true);
  }

  function openEditModal(task) {
    setEditingTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description || '');
    setCountryId(task.countryId || 'japan');
    setCategory(task.category || 'research');
    setPriority(task.priority || 'medium');
    setStatus(task.status || 'pending');
    setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    setModalOpen(true);
  }

  async function handleSaveTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        countryId,
        category,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      };

      if (editingTaskId) {
        await taskAPI.update(editingTaskId, payload);
        showToast('Research task updated successfully');
      } else {
        await taskAPI.create(payload);
        showToast('New expedition task created');
      }

      setModalOpen(false);
      loadTasks();
    } catch (err) {
      showToast(err.message || 'Error saving task');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(task) {
    const nextStatus =
      task.status === 'pending'
        ? 'in_progress'
        : task.status === 'in_progress'
        ? 'completed'
        : 'pending';

    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
      );
      await taskAPI.update(task._id, { status: nextStatus });
      showToast(`Task status: ${nextStatus.replace('_', ' ')}`);
    } catch {
      showToast('Failed to update status');
      loadTasks();
    }
  }

  async function handleDeleteTask(taskId) {
    if (!window.confirm('Are you sure you want to delete this research task?')) return;

    try {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      await taskAPI.delete(taskId);
      showToast('Task deleted');
    } catch {
      showToast('Failed to delete task');
      loadTasks();
    }
  }

  // Task Stats Summary
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;

  return (
    <main className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter pt-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
            <span className="text-label-md text-secondary font-bold tracking-wider">EXPEDITION MANAGEMENT</span>
          </div>
          <h1 className="text-[28px] md:text-headline-lg font-bold text-on-surface">Atlas Research Tasks</h1>
          <p className="text-body-sm text-on-surface-variant">
            Create, track, and manage geopolitical analysis expeditions and study tasks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary hover:bg-secondary transition-all text-label-md font-semibold shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>New Task</span>
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-semibold text-label-md hover:bg-secondary/90 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Sign In to Manage Tasks</span>
            </button>
          )}
        </div>
      </div>

      {!isAuthenticated ? (
        /* Sign-in prompt card */
        <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary text-3xl">
            🧭
          </div>
          <div className="space-y-1">
            <h3 className="text-headline-sm font-bold text-on-surface">Atlas Research Tasks</h3>
            <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
              Authenticate to create persistent field expeditions, assign country research targets, and track demographic analysis tasks in MongoDB.
            </p>
          </div>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-primary-container text-on-primary font-semibold text-label-md hover:bg-secondary transition-all shadow-sm"
          >
            Sign In / Register
          </button>
        </div>
      ) : (
        <>
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-outline uppercase font-semibold">TOTAL TASKS</span>
                <div className="text-headline-sm font-bold text-on-surface">{totalCount}</div>
              </div>
              <span className="material-symbols-outlined text-secondary text-2xl">list_alt</span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-outline uppercase font-semibold">IN PROGRESS</span>
                <div className="text-headline-sm font-bold text-blue-700">{inProgressCount}</div>
              </div>
              <span className="material-symbols-outlined text-blue-600 text-2xl">autorenew</span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-outline uppercase font-semibold">COMPLETED</span>
                <div className="text-headline-sm font-bold text-emerald-700">{completedCount}</div>
              </div>
              <span className="material-symbols-outlined text-emerald-600 text-2xl">task_alt</span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-outline uppercase font-semibold">PENDING</span>
                <div className="text-headline-sm font-bold text-amber-700">{pendingCount}</div>
              </div>
              <span className="material-symbols-outlined text-amber-600 text-2xl">schedule</span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface-container-low/60 p-3 rounded-2xl border border-outline-variant/30">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">search</span>
              <input
                type="text"
                placeholder="Filter tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface text-body-sm outline-none focus:border-secondary"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
              <span className="text-label-md text-outline font-semibold shrink-0">Status:</span>
              {['all', 'pending', 'in_progress', 'completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full text-label-md capitalize shrink-0 transition-all ${
                    statusFilter === st
                      ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                      : 'bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          {loading ? (
            <div className="p-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin text-3xl text-secondary">sync</span>
              <p className="text-body-sm mt-2">Loading tasks from MongoDB...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 space-y-3">
              <span className="material-symbols-outlined text-4xl text-outline">assignment_late</span>
              <h3 className="text-title-md font-bold text-on-surface">No Research Tasks Found</h3>
              <p className="text-body-sm text-on-surface-variant max-w-sm mx-auto">
                No tasks match your current filter criteria. Create a new task to get started.
              </p>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 rounded-xl bg-primary-container text-on-primary text-label-md font-semibold hover:bg-secondary transition-all"
              >
                Create Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => {
                const country = task.countryId ? countries[task.countryId] : null;
                const priorityInfo =
                  PRIORITIES.find((p) => p.value === task.priority) || PRIORITIES[1];

                return (
                  <div
                    key={task._id}
                    className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {country && (
                            <Link
                              to={`/country/${country.id}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-label-md font-semibold hover:bg-surface-container-high transition-colors text-on-surface"
                            >
                              <span>{country.flag}</span>
                              <span>{country.name}</span>
                            </Link>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${priorityInfo.color}`}>
                            {priorityInfo.label} Priority
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-container text-on-surface-variant capitalize">
                            {task.category?.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Status Toggle Button */}
                        <button
                          onClick={() => handleToggleStatus(task)}
                          className={`px-2.5 py-0.5 rounded-full text-label-md font-semibold flex items-center gap-1 transition-all ${
                            task.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : task.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                          title="Click to advance status"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {task.status === 'completed'
                              ? 'check_circle'
                              : task.status === 'in_progress'
                              ? 'autorenew'
                              : 'radio_button_unchecked'}
                          </span>
                          <span className="capitalize">{task.status.replace('_', ' ')}</span>
                        </button>
                      </div>

                      {/* Title & Description */}
                      <h3
                        className={`text-title-md font-bold text-on-surface ${
                          task.status === 'completed' ? 'line-through text-outline' : ''
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Footer with Due Date & Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20 text-body-sm">
                      <div className="flex items-center gap-1 text-outline text-label-md">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        <span>
                          {task.dueDate
                            ? `Due: ${new Date(task.dueDate).toLocaleDateString()}`
                            : 'No due date'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(task)}
                          className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors"
                          title="Edit Task"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-1.5 rounded-lg text-outline hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Task"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Create / Edit Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-outline hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <h2 className="text-headline-sm font-bold text-on-surface">
              {editingTaskId ? 'Edit Research Task' : 'New Expedition Task'}
            </h2>

            <form onSubmit={handleSaveTask} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-label-md font-semibold text-on-surface">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Analyze Japan semiconductor trade policy"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder:text-outline text-body-md focus:border-secondary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-label-md font-semibold text-on-surface">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Field notes, research questions, and data objectives..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder:text-outline text-body-sm focus:border-secondary outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-label-md font-semibold text-on-surface">Target Country</label>
                  <select
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm outline-none"
                  >
                    {Object.values(countries).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-label-md font-semibold text-on-surface">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-label-md font-semibold text-on-surface">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm outline-none"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-label-md font-semibold text-on-surface">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-label-md font-semibold text-on-surface">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/40 text-on-surface hover:bg-surface-container-low text-label-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary-container text-on-primary text-label-md font-semibold hover:bg-secondary transition-all shadow-sm"
                >
                  {saving ? 'Saving...' : editingTaskId ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

