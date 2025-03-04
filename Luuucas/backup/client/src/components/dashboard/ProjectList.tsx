import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { type Project } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
}

const ProjectList = ({ projects, isLoading }: ProjectListProps) => {
  const { toast } = useToast();

  // Get status badge styles
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'On Track':
        return 'bg-green-100 text-green-800';
      case 'At Risk':
        return 'bg-amber-100 text-amber-800';
      case 'Planning':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get progress bar color
  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'On Track':
        return 'bg-blue-500';
      case 'At Risk':
        return 'bg-amber-500';
      case 'Planning':
        return 'bg-blue-500';
      case 'Completed':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
      {isLoading ? (
        // Skeleton loading for projects
        <ul className="divide-y divide-gray-200">
          {Array(3).fill(0).map((_, index) => (
            <li key={index} className="p-4 animate-pulse">
              <div className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row justify-between">
                <div className="flex flex-col sm:flex-row">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2 sm:mb-0"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 sm:ml-6"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24 mt-2 sm:mt-0"></div>
              </div>
              <div className="mt-4 h-2 bg-gray-200 rounded"></div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-gray-200">
          {projects.length === 0 ? (
            <li className="text-center p-8 text-gray-500">No projects found. Create your first project!</li>
          ) : (
            projects.map((project) => (
              <li key={project.id}>
                <a href="#" className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{project.name}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(project.status)}`}>
                          {project.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          <span>{project.category}</span>
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{project.teamMembers} team member{project.teamMembers !== 1 ? 's' : ''}</span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>
                          Due <time dateTime={project.dueDate}>{project.dueDate}</time>
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="relative">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div 
                            style={{ width: `${project.progress}%` }} 
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressBarColor(project.status)}`}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-right text-gray-500">{project.progress}% complete</div>
                    </div>
                  </div>
                </a>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;
