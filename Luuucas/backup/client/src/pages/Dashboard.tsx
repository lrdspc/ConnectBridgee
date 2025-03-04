import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import ProjectList from "@/components/dashboard/ProjectList";
import TaskList from "@/components/dashboard/TaskList";
import NewProjectModal from "@/components/modals/NewProjectModal";
import NewTaskModal from "@/components/modals/NewTaskModal";
import { type Stat, type Project, type Task } from "@shared/schema";

const Dashboard = () => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Fetch stats data
  const { data: stats, isLoading: statsLoading } = useQuery<Stat[]>({
    queryKey: ['/api/stats'],
  });

  // Fetch projects data
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Fetch tasks data
  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="px-4 sm:px-0 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          A high-level overview of your productivity metrics and active projects.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0 mb-8">
        {statsLoading ? (
          // Skeleton loading for stats
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg p-4 animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : (
          stats?.map((stat) => (
            <StatsCard key={stat.id} stat={stat} />
          ))
        )}
      </div>

      {/* Project Section */}
      <div className="px-4 sm:px-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-900">Active Projects</h2>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>

        <ProjectList 
          projects={projects || []} 
          isLoading={projectsLoading} 
        />
      </div>

      {/* Task Section */}
      <div className="px-4 sm:px-0 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-900">Recent Tasks</h2>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setIsNewTaskModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>

        <TaskList 
          tasks={tasks || []} 
          isLoading={tasksLoading} 
          projects={projects || []}
        />
      </div>

      {/* Modals */}
      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={() => setIsNewProjectModalOpen(false)} 
      />
      
      <NewTaskModal 
        isOpen={isNewTaskModalOpen} 
        onClose={() => setIsNewTaskModalOpen(false)} 
        projects={projects || []}
      />
    </div>
  );
};

export default Dashboard;
