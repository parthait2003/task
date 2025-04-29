"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DataTable } from "mantine-datatable";
import IconEye from "@/components/icon/icon-eye";

const TasksByOwner = () => {
  const { id: ownerId } = useParams(); // Get owner ID from URL
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    if (ownerId) {
      fetchProjects();
    }
  }, [ownerId]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/project");
      const data = await res.json();

      // Filter projects where ownerId is in the assignees array
      const assignedProjects = data.filter((project) =>
        project.assignees.some((assignee) => assignee.id === ownerId)
      );

      setFilteredProjects(assignedProjects);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  

  return (
    <div className="panel mt-6">
      

      <DataTable
        records={filteredProjects}
        columns={[
          {
            accessor: "assignees",
            title: "Assignees",
            render: (row) =>
              row.assignees.map((a) => a.name).join(", "),
          },
          { accessor: "project", title: "Project Name" },
          {
            accessor: "actions",
            title: "Actions",
            render: (row) => (
              <div className="flex space-x-2">
               
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => window.location.href = `/viewtask/assignees/${row._id}`}


                >
                  <IconEye />
                </button>
              </div>
            ),
          },
          
          
        ]}
        noRecordsText="No projects assigned."
      />
    </div>
  );
};

export default TasksByOwner;
