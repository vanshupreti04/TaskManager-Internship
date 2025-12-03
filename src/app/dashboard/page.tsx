'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    useDraggable,
    useDroppable,
} from '@dnd-kit/core';
import {
    Add,
    Delete,
    Edit,
    CalendarMonth,
    Flag,
    DragIndicator,
    Search,
    FilterList,
    WarningAmber,
    Menu,
    Close,
} from '@mui/icons-material';

// --- Types ---
interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
}

// --- Draggable Task Card Component ---
function TaskCard({ task, onDeleteClick, onEditClick }: {
    task: Task;
    onDeleteClick: (id: string) => void;
    onEditClick: (task: Task) => void
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task._id,
        data: { ...task },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const priorityColors: Record<string, string> = {
        low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        medium: 'bg-amber-100 text-amber-800 border-amber-200',
        high: 'bg-rose-100 text-rose-800 border-rose-200',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                bg-white rounded-xl border border-gray-200 mb-2 p-3 sm:p-4
                shadow-sm hover:shadow-md transition-all duration-200
                cursor-grab active:cursor-grabbing
                ${isDragging ? 'opacity-40 shadow-lg' : ''}
                hover:-translate-y-0.5
            `}
            {...listeners}
            {...attributes}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 flex-1">
                    <DragIndicator className="w-4 h-4 text-gray-400 shrink-0" />
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{task.title}</h3>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 ml-2 shrink-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditClick(task);
                        }}
                        className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        title="Edit task"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick(task._id);
                        }}
                        className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Delete task"
                    >
                        <Delete className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>

            <div className="flex items-center gap-2 flex-wrap">
                <span
                    className={`
                        px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1
                        ${priorityColors[task.priority]}
                    `}
                >
                    <Flag className="w-3 h-3" />
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>

                {task.dueDate && (
                    <span className="px-2 py-1 rounded-full text-xs text-gray-600 bg-gray-100 border border-gray-200 flex items-center gap-1">
                        <CalendarMonth className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                )}
            </div>
        </div>
    );
}

// --- Droppable Column Component ---
function Column({ id, title, tasks, onDeleteClick, onEditClick }: {
    id: string;
    title: string;
    tasks: Task[];
    onDeleteClick: (id: string) => void;
    onEditClick: (task: Task) => void
}) {
    const { setNodeRef, isOver } = useDroppable({ id });

    const columnColors: Record<string, string> = {
        todo: 'border-blue-200 bg-blue-50',
        'in-progress': 'border-yellow-200 bg-yellow-50',
        completed: 'border-green-200 bg-green-50',
    };

    const titleColors: Record<string, string> = {
        todo: 'text-blue-700',
        'in-progress': 'text-yellow-700',
        completed: 'text-green-700',
    };

    return (
        <div
            ref={setNodeRef}
            className={`
                rounded-2xl border-2 p-3 sm:p-4 h-full flex flex-col
                ${columnColors[id]}
                ${isOver ? 'ring-2 ring-emerald-300' : ''}
            `}
        >
            <div className="flex justify-between items-center mb-3 px-1">
                <h2 className={`font-bold text-base sm:text-lg ${titleColors[id]}`}>
                    {title}
                </h2>
                <span className="bg-white text-gray-700 text-xs font-bold px-2 sm:px-3 py-1 rounded-full border border-gray-200">
                    {tasks.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {tasks.map((task) => (
                    <TaskCard key={task._id} task={task} onDeleteClick={onDeleteClick} onEditClick={onEditClick} />
                ))}

                {tasks.length === 0 && (
                    <div className="h-24 sm:h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs sm:text-sm bg-white/50">
                        No tasks yet
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Modal Container Component ---
function ModalContainer({ children, isOpen, onClose }: {
    children: React.ReactNode;
    isOpen: boolean;
    onClose?: () => void;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop with fade and blur */}
            <div 
                className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
                onClick={onClose}
            />
            
            {/* Modal Container */}
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
                    {/* Modal Content */}
                    <div className="relative w-full max-w-md">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Mobile Controls Component ---
function MobileControls({ 
    searchQuery, 
    setSearchQuery, 
    filterPriority, 
    setFilterPriority, 
    onNewTask,
    isFiltersOpen,
    setIsFiltersOpen
}: {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    filterPriority: string;
    setFilterPriority: (value: string) => void;
    onNewTask: () => void;
    isFiltersOpen: boolean;
    setIsFiltersOpen: (value: boolean) => void;
}) {
    return (
        <div className="lg:hidden space-y-4 mb-4">
            {/* Top Row: Search and Menu */}
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-700 placeholder-slate-500 transition-colors"
                        />
                    </div>
                </div>
                <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    {isFiltersOpen ? (
                        <Close className="w-5 h-5 text-slate-600" />
                    ) : (
                        <FilterList className="w-5 h-5 text-slate-600" />
                    )}
                </button>
                <button
                    onClick={onNewTask}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium flex items-center justify-center transition-colors shadow-lg shadow-emerald-100 hover:shadow-emerald-200"
                >
                    <Add className="w-5 h-5" />
                </button>
            </div>

            {/* Filters Panel */}
            {isFiltersOpen && (
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                        <FilterList className="w-5 h-5 text-slate-400" />
                        <h3 className="font-medium text-slate-700">Filter by Priority</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setFilterPriority('all')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterPriority === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterPriority('low')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterPriority === 'low' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            Low
                        </button>
                        <button
                            onClick={() => setFilterPriority('medium')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterPriority === 'medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            Medium
                        </button>
                        <button
                            onClick={() => setFilterPriority('high')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterPriority === 'high' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            High
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Main Dashboard Page ---
export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState<string>('all');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
        dueDate: '',
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
        useSensor(KeyboardSensor)
    );

    // Fetch tasks
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
            showNotification('Failed to fetch tasks', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Drag & Drop
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const taskId = active.id as string;
        const newStatus = over.id as Task['status'];

        const currentTask = tasks.find((t) => t._id === taskId);
        if (currentTask && currentTask.status !== newStatus) {
            const updatedTasks = tasks.map((t) =>
                t._id === taskId ? { ...t, status: newStatus } : t
            );
            setTasks(updatedTasks);

            try {
                await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
            } catch (error) {
                console.error('Failed to update status', error);
                fetchTasks();
            }
        }
    };

    // Task Operations
    const handleOpenCreate = () => {
        setEditingId(null);
        setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
        setIsModalOpen(true);
        setIsFiltersOpen(false);
    };

    const handleOpenEdit = (task: Task) => {
        setEditingId(task._id);
        setNewTask({
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        });
        setIsModalOpen(true);
        setIsFiltersOpen(false);
    };

    const handleSaveTask = async () => {
        try {
            if (!newTask.title.trim()) return;

            if (editingId) {
                await axios.put(`/api/tasks/${editingId}`, newTask);
                showNotification('Task updated successfully', 'success');
            } else {
                await axios.post('/api/tasks', { ...newTask, status: 'todo' });
                showNotification('Task created successfully', 'success');
            }

            setIsModalOpen(false);
            fetchTasks();
        } catch (error) {
            console.error('Failed to save task', error);
            showNotification('Failed to save task', 'error');
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`/api/tasks/${deleteId}`);
            setTasks(tasks.filter((t) => t._id !== deleteId));
            showNotification('Task deleted successfully', 'success');
        } catch (error) {
            console.error('Failed to delete task', error);
            showNotification('Failed to delete task', 'error');
        } finally {
            setDeleteId(null);
        }
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        if (type === 'success') {
            alert(`✅ ${message}`);
        } else {
            alert(`❌ ${message}`);
        }
    };

    // Filtering Logic
    const filteredTasks = tasks.filter((task) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower);
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    const activeTask = activeId ? tasks.find((t) => t._id === activeId) : null;

    return (
        <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6">
            {/* MOBILE CONTROLS */}
            <MobileControls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                onNewTask={handleOpenCreate}
                isFiltersOpen={isFiltersOpen}
                setIsFiltersOpen={setIsFiltersOpen}
            />

            {/* DESKTOP CONTROLS BAR */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    {/* LEFT SECTION - Search */}
                    <div className="w-full lg:w-1/3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-700 placeholder-slate-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* CENTER SECTION - Filter */}
                    <div className="w-full lg:w-1/3 flex justify-center">
                        <div className="relative w-full max-w-xs">
                            <FilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white text-slate-700 transition-colors"
                            >
                                <option value="all">All Priorities</option>
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                        </div>
                    </div>

                    {/* RIGHT SECTION - New Task Button */}
                    <div className="w-full lg:w-1/3 flex justify-end">
                        <button
                            onClick={handleOpenCreate}
                            className="w-full lg:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-100 hover:shadow-emerald-200 whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Add className="w-5 h-5" />
                            New Task
                        </button>
                    </div>
                </div>
            </div>

            {/* KANBAN BOARD CONTAINER */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                ) : (
                    <div className="h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] min-h-[500px]">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragStart={(event) => setActiveId(event.active.id as string)}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 h-full">
                                {['todo', 'in-progress', 'completed'].map((status) => (
                                    <Column
                                        key={status}
                                        id={status}
                                        title={status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Completed'}
                                        tasks={filteredTasks.filter((t) => t.status === status)}
                                        onDeleteClick={setDeleteId}
                                        onEditClick={handleOpenEdit}
                                    />
                                ))}
                            </div>

                            {/* DRAG OVERLAY */}
                            <DragOverlay>
                                {activeTask && (
                                    <div className="bg-white rounded-xl border border-emerald-100 p-3 shadow-xl opacity-90 max-w-xs ring-1 ring-emerald-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DragIndicator className="w-4 h-4 text-emerald-500" />
                                            <h3 className="font-semibold text-slate-800 text-sm">{activeTask.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                activeTask.priority === 'low' ? 'bg-emerald-100 text-emerald-800' :
                                                activeTask.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                                                'bg-rose-100 text-rose-800'
                                            }`}>
                                                {activeTask.priority}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </DragOverlay>
                        </DndContext>
                    </div>
                )}
            </div>

            {/* CREATE/EDIT TASK MODAL */}
            <ModalContainer isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 sm:p-6 transform transition-all duration-300 ease-out scale-100 opacity-100 mx-2">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                            {editingId ? 'Edit Task' : 'Add New Task'}
                        </h2>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Task Title *
                            </label>
                            <input
                                type="text"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="w-full px-3 sm:px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-700 placeholder-slate-500 transition-colors"
                                placeholder="e.g. Design Homepage"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                className="w-full px-3 sm:px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-700 placeholder-slate-500 transition-colors"
                                placeholder="Add details about this task..."
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Priority
                                </label>
                                <select
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                                    className="w-full px-3 sm:px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-700 transition-colors"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-700 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 text-slate-600 hover:text-slate-900 font-medium rounded-lg transition-colors hover:bg-slate-100 order-2 sm:order-1"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveTask}
                            disabled={!newTask.title.trim()}
                            className={`
                                w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-all mb-2 sm:mb-0 order-1 sm:order-2
                                ${newTask.title.trim()
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 hover:shadow-emerald-200 hover:-translate-y-0.5 active:translate-y-0'
                                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                }
                            `}
                        >
                            {editingId ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </div>
            </ModalContainer>

            {/* DELETE CONFIRMATION MODAL */}
            <ModalContainer isOpen={!!deleteId} onClose={() => setDeleteId(null)}>
                <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-center border border-slate-100 transform transition-all duration-300 ease-out scale-100 opacity-100 mx-2">
                    <WarningAmber className="w-12 h-12 sm:w-16 sm:h-16 text-rose-500 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Delete this task?</h3>
                    <p className="text-slate-600 text-sm sm:text-base mb-4 sm:mb-6">
                        This action cannot be undone. Are you sure you want to remove this task?
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                        <button
                            onClick={() => setDeleteId(null)}
                            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 text-slate-600 hover:text-slate-900 font-medium rounded-lg transition-colors hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-rose-100 hover:shadow-rose-200 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Delete Task
                        </button>
                    </div>
                </div>
            </ModalContainer>
        </div>
    );
}