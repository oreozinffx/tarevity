"use client";

import { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

interface TodoFiltersProps {
  filters: {
    status: string;
    priority: string;
    search: string;
  };
  setFilters: (filters: any) => void;
}

export default function TodoFilters({ filters, setFilters }: TodoFiltersProps) {
  const [search, setSearch] = useState(filters.search);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, status: e.target.value });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, priority: e.target.value });
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilters({
      status: "all",
      priority: "all",
      search: "",
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-1/2">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Pesquisar tarefas..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-1/2">
          <div className="w-full sm:w-1/2">
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Pendentes</option>
              <option value="completed">Concluídas</option>
            </select>
          </div>

          <div className="w-full sm:w-1/2">
            <select
              value={filters.priority}
              onChange={handlePriorityChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todas as Prioridades</option>
              <option value="3">Prioridade Alta</option>
              <option value="2">Prioridade Média</option>
              <option value="1">Prioridade Baixa</option>
            </select>
          </div>
        </div>
      </div>

      {(filters.status !== "all" ||
        filters.priority !== "all" ||
        filters.search) && (
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <FaFilter className="mr-1" />
            <span>Filtros aplicados</span>
          </div>
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
