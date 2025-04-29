"use client";
import MultiStepProgressBar from "@/components/datatables/components-datatables-multiprogressbar";
import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { DataTable } from "mantine-datatable";
import Select from "react-select";
import Swal from "sweetalert2";
import IconPlus from "@/components/icon/icon-plus";
import IconPencil from "@/components/icon/icon-pencil";
import IconTrash from "@/components/icon/icon-trash";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { format } from "date-fns";
import { useParams } from "next/navigation";

const ComponentsDatatablesTask = () => {
    const [modal, setModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [owners, setOwners] = useState([]);
    const [projects, setProjects] = useState([]);
    const [templates, setTemplates] = useState([]);
    const { id: projectId } = useParams();
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        id: null,
        title: "",
        type: "team",
        stage: "",
        status: "",
        details: "",
        dueDate: "",
        projectId: "",
        templateId: "",
    });
    const [steps, setSteps] = useState([
        { label: 'Onboarding Stage', status: 'upcoming' },
        { label: 'Design Stage', status: 'upcoming' },
        { label: 'Development', status: 'upcoming' },
        { label: 'Website Review', status: 'upcoming' },
        { label: 'Deployment', status: 'upcoming' },
        { label: 'Offboarding', status: 'upcoming' },
    ]);

    // Define order for stage progression
    const stageOrder = [
        'onboarding stage',
        'design stage',
        'development',
        'website review',
        'deployment',
        'offboarding'
    ];

    useEffect(() => {
        fetchTasks();
        fetchOwners();
        fetchProjects();
        fetchTemplates();
    }, [projectId]); // Re-fetch tasks when projectId changes

    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/project");
            const data = await res.json();
            console.log("API Response:", data); 
    
            if (data.success && data.data) {
               
                const project = data.data.find(project => String(project._id) === String(projectId));

                console.log("Found project:", project); // Log project for debugging
    
                if (project) {
                    // Extract tasks for the found project
                    const projectTasks = project.tasks || [];
                    console.log("Project Tasks:", projectTasks); // Log tasks
                    setTasks(projectTasks); // Set tasks in the state
                } else {
                    console.log("Project not found.");
                    setTasks([]); // If no project found, set empty tasks
                }
            } else {
                console.error("No project data found or error in fetching projects.");
                setTasks([]); // Set empty tasks if there's an issue
            }
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
            setTasks([]); // Set empty tasks in case of error
        }
    };
    
    

    const fetchOwners = async () => {
        try {
            const response = await fetch("/api/owner");
            const data = await response.json();
            setOwners(data.owners || []);
        } catch (error) {
            console.error("Error fetching owners:", error);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/project");
            const data = await res.json();
            setProjects(data.data || []);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        }
    };

    const fetchTemplates = async () => {
        try {
            const res = await fetch("/api/template");
            const data = await res.json();
            setTemplates(data || []);
        } catch (err) {
            console.error("Failed to fetch templates:", err);
        }
    };

    const assigneeOptions = owners.map(owner => ({
        value: owner._id,
        label: owner.name,
    }));

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddClick = () => {
        setFormData({
            id: null,
            title: "",
            type: "team",
            stage: "",
            status: "",
            details: "",
            dueDate: "",
            projectId: "",
            templateId: "",
        });
        setIsEditMode(false);
        setModal(true);
    };

    const handleEditClick = (id) => {
        const task = tasks.find((t) => t._id === id);
        if (task) {
            setFormData({
                id: task._id,
                title: task.title || "",
                type: task.type || "team",
                stage: task.stage || "",
                status: task.status || "",
                details: task.details || "",
                dueDate: task.dueDate || "",
                projectId: task.projectId || "",
                templateId: task.templateId || "",
            });
            setIsEditMode(true);
            setModal(true);
        }
    };

    const handleDeleteClick = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await fetch(`/api/task/${id}`, { method: "DELETE" });
                Swal.fire("Deleted!", "Task has been deleted.", "success");
                fetchTasks();
            } catch (err) {
                Swal.fire("Error!", "Failed to delete task.", "error");
            }
        }
    };

    return (
        <div className="panel mt-6">
            <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Tasks</h5>
            <div className="max-w-3xl mx-auto mt-10">
                <MultiStepProgressBar steps={steps} />
            </div>
            <div className="flex gap-4 mb-4">
                <button className="btn btn-primary" onClick={handleAddClick}>
                    <IconPlus /> Add Task
                </button>
            </div>
            <DataTable
                records={tasks}
                columns={[
                    { accessor: "title", title: "Title" },
                  
                    { accessor: "stage", title: "Stage" },
                    { accessor: "status", title: "Status" },
                    { accessor: "dueDate", title: "Due Date" },
                    {
                        accessor: "actions",
                        title: "Actions",
                        render: (row) => (
                            <div className="flex space-x-2">
                                <button className="btn btn-sm btn-primary" onClick={() => handleEditClick(row._id)}>
                                    <IconPencil />
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(row._id)}>
                                    <IconTrash />
                                </button>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default ComponentsDatatablesTask;
