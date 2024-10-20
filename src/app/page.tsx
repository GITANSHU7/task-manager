"use client";

import axios from "axios";
import {
  Button,
  Card,
  Label,
  Modal,
  Pagination,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { HiOutlineExclamationCircle, HiPlusCircle } from "react-icons/hi";
import { IoIosRefreshCircle } from "react-icons/io";
import { RiDeleteBin6Fill } from "react-icons/ri";
import * as yup from "yup";

interface User {
  _id: any;
  name: string;
  email: string;
  username: string;
}

interface TaskData {
  _id: any;
  title: string;
  description: string;
  status: string;
  due_date: any;
  priority: string;
  user: any;
  assign: string;
  createdAt: string;
}

const taskSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  user: yup.string().required("User must be selected"),
  status: yup.string().required("Status must be selected"),
  priority: yup.string().required("Priority must be selected"),
  due_date: yup.date().min(new Date(), "Due date must be today or later").required("Due date is required"),
});


const Home = () => {
  const [data, setData] = useState<TaskData[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [newTask, setNewTask] = useState<
    | TaskData
    | {
        title: string;
        description: string;
        status: string;
        due_date: any;
        priority: string;
        user: string;
      }
  >({
    title: "",
    description: "",
    status: "",
    due_date: "",
    priority: "",
    user: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const listTasks = async () => {
    try {
      const response = await axios.post("/api/tasks/list");
      setLoading(false);
      setData(response?.data?.data);
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.error(error);
    }
  };



  const fetchUsers = async () => {
    try {
      const response = await axios.post("/api/users/list", null);
      setUsers(response?.data?.data);
    } catch (error: any) {
      console.error(error.message || "Error fetching user list");
      toast.error(error.response.data.error);
    }
  };
  // delete task
  const deleteTask = async () => {
    if (!taskIdToDelete) return;

    try {
      const response = await axios.delete(
        `/api/tasks/delete/${taskIdToDelete}`
      );
      await listTasks();
      toast.success("User deleted successfully");
      setDeleteModalOpen(false);
      setTaskIdToDelete(null);
    } catch (error: any) {
      console.error(error.message || "Error deleting user");
      toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    listTasks();
    fetchUsers();
  }, []);

  // const editTask = async () => {
  //   if (!taskToEdit) return;

  //   try {
  //     const response = await axios.put(
  //       `/api/tasks/update/${taskToEdit._id}`,
  //       taskToEdit
  //     );
  //     await listTasks();
  //     toast.success("User updated successfully");
  //     setEditModalOpen(false);
  //     setTaskToEdit(null);
  //   } catch (error: any) {
  //     console.error(error.message || "Error updating user");
  //     toast.error(error.response.data.error);
  //   }
  // };

  // create task
  // const createTask = async () => {
  //   try {
  //     const response = await axios.post("/api/tasks/create", newTask);
  //     await listTasks();
  //     toast.success("Task created successfully");
  //     setCreateModalOpen(false);
  //     setNewTask({
  //       title: "",
  //       description: "",
  //       status: "",
  //       due_date: "",
  //       priority: "",
  //       user: "",
  //     });
  //   } catch (error: any) {
  //     console.error(error.message || "Error creating task");
  //     toast.error(error.response.data.error);
  //   }
  // };
 
  const editTask = async () => {
    if (!taskToEdit) return;
  
    try {
     
      await taskSchema.validate(taskToEdit, { abortEarly: false });
  
  setIsUpdateDisabled(true);
  
      // Send update request
      const response = await axios.put(
        `/api/tasks/update/${taskToEdit._id}`,
        taskToEdit
      );
  
      // Refresh task list after editing
      await listTasks();
  
      // Display success message
      toast.success("Task updated successfully");
  
      // Close the modal and reset the form data
      setEditModalOpen(false);
      setTaskToEdit(null);
      setErrors({});
    } catch (error: any) {
      // Handle validation errors from Yup
      if (error.name === "ValidationError") {
        const validationErrors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          validationErrors[err.path as string] = err.message;
        });
        setErrors(validationErrors);
      } else {
        // Log and display API error
        console.error(error.message || "Error updating task");
        toast.error(error.response?.data?.error || "An error occurred");
      }
    } finally {
      // Reset loading state
      setIsUpdateDisabled(false);
    }
  };
  

  const createTask = async () => {
    try {
      
      await taskSchema.validate(newTask, { abortEarly: false });
  
      setIsSaveDisabled(true);

      const response = await axios.post("/api/tasks/create", newTask);
  
      await listTasks();

      toast.success("Task created successfully");
  
      setCreateModalOpen(false);
      setNewTask({
        title: "",
        description: "",
        status: "",
        due_date: "",
        priority: "",
        user: "",
      });
      setErrors({});
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const validationErrors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error(error.message || "Error creating task");
        toast.error(error.response?.data?.error || "An error occurred");
      }
    } finally {
      setIsSaveDisabled(false);
    }
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredData = data.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assign.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const serialNumber = indexOfFirstItem + 1;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDeleteClick = (id: string) => {
    setTaskIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (task: TaskData) => {
    setTaskToEdit(task);
    setEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  function formatDate(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // status color
  const statusColor = (status: string) => {
    switch (status) {
      case "todo":
        return  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">To-Do</span>;
      case "inProgress":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">In Progress</span>;
      case "completed":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>;
      default:
        return "bg-gray-500";
    }
  };

  // priority color
  const priorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Low</span>;
      case "medium":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Medium</span>;
      case "high":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">High</span>;
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>

    {/* {data.length > 0 ? (
      <> */}

      <div>
        <h1 className="my-10 ml-7 text-xl font-semibold dark:text-white">
          Task List
          <div className="float-right rtl:float-left">
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button color="gray" onClick={handleCreateClick}>
                <HiPlusCircle className="mr-2 h-5 w-5" />
                Add Task
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  listTasks();
                  toast.success("Task list refreshed successfully");
                }}
              >
                <IoIosRefreshCircle className="mr-2 h-5 w-5" />
                Refresh
              </Button>
            </div>
          </div>
        </h1>
        <div className="flex justify-end items-end mb-3">
            <TextInput
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
          {data.length > 0 ? (
      <>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [...Array(itemsPerPage)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              ))
            : currentData.map((task, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                      {task.title}
                    </h5>
                    <div className="flex space-x-2">
                      <Button.Group>
                        <Button
                          color="blue"
                          pill
                          onClick={() => handleEditClick(task)}
                          size={"sm"}
                        >
                          <FaEdit size={"sm"} className="h-5 w-5" />
                        </Button>

                        <Button
                          color="failure"
                          pill
                          onClick={() => handleDeleteClick(task._id)}
                          size={"sm"}
                        >
                          <RiDeleteBin6Fill className="h-5 w-5" />
                        </Button>
                      </Button.Group>
                    </div>
                  </div>

                  <div className="flow-root">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      <li className="pb-0 pt-3 sm:pt-4 mb-2">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              Description
                            </p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                              {task.description}
                            </p>
                          </div>
                        </div>
                      </li>
                      <li className="pb-0 pt-3 sm:pt-4 mb-2">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              Assign to
                            </p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                              {task.assign}
                            </p>
                          </div>
                        </div>
                      </li>
                      <li className="pb-0 pt-3 sm:pt-4 mb-2">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              Status
                            </p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                             {statusColor(task.status)}
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                Priority
                              </p>
                              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                               {priorityColor(task.priority)}
                              </p> 
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="pb-0 pt-3 sm:pt-4 mb-2">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              Created At
                            </p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(task.createdAt)}
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                Due Date
                              </p>
                              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(task.due_date)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Card>
              ))}
        </div>

        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        </div>
     
      </>
    ) : (
      <div className="flex justify-center items-center h-[50vh] text-2xl sm:text-3xl md:text-4xl lg:text-5xl dark:text-white">
        No Task Found, Please Create One
        </div>
    )}
    </div>

      {/* Delete Modal */}
      <Modal
        show={deleteModalOpen}
        size="md"
        onClose={() => setDeleteModalOpen(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteTask}>
                Yes
              </Button>
              <Button color="gray" onClick={() => setDeleteModalOpen(false)}>
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={editModalOpen}
        size="md"
        onClose={() => setEditModalOpen(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Edit User
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="title" value="Title" />
                <TextInput
                  id="title"
                  type="text"
                  value={taskToEdit?.title || ""}
                  onChange={(e) =>
                    setTaskToEdit({
                      ...taskToEdit,
                      title: e.target.value,
                    } as TaskData)
                  }
                />
                {errors.title && <p className="text-red-600">{errors.title}</p>}
              </div>
              <div>
                <Label htmlFor="description" value="Description" />
                <Textarea
                  id="description"
                  value={taskToEdit?.description || ""}
                  onChange={(e) =>
                    setTaskToEdit({
                      ...taskToEdit,
                      description: e.target.value,
                    } as TaskData)
                  }
                />
                {errors.description && <p className="text-red-600">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="user" value="Assign To" />
                <Select
                  id="user"
                  value={taskToEdit?.user || ""}
                  onChange={(e) =>
                    setTaskToEdit({
                      ...taskToEdit,
                      user: e.target.value,
                    } as TaskData)
                  }
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </Select>
                {errors.user && <p className="text-red-600">{errors.user}</p>}
              </div>
              <div>
                <Label htmlFor="status" value="Status" />
                <Select
                  id="status"
                  value={taskToEdit?.status}
                  onChange={(e) =>
                    setTaskToEdit({
                      ...taskToEdit,
                      status: e.target.value,
                    } as TaskData)
                  }
                >
                  <option value="">Select Status</option>
                  <option value="todo">To-Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="completed">Completed</option>
                </Select>
                {errors.status && <p className="text-red-600">{errors.status}</p>}
              </div>
              <div>
                <Label htmlFor="priority" value="Priority" />
                <Select
                  id="priority"
                  value={taskToEdit?.priority}
                  onChange={(e) =>
                    setTaskToEdit({
                      ...taskToEdit,
                      priority: e.target.value,
                    } as TaskData)
                  }
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
                {errors.priority && <p className="text-red-600">{errors.priority}</p>}
              </div>

              <div>
                <Label htmlFor="due_date" value="Due Date" />
                <input
                  id="due_date"
                  type="date"
                  value={
                    taskToEdit?.due_date
                      ? new Date(taskToEdit.due_date)
                          .toISOString()
                          .split("T")[0] 
                      : ""
                  }
                  min={new Date().toISOString().split("T")[0]} 
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  onChange={(e) =>
                    setTaskToEdit({
                      ...taskToEdit,
                      due_date: e.target.value,
                    } as TaskData)
                  }
                />
                {errors.due_date && <p className="text-red-600">{errors.due_date}</p>}
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button color="success" onClick={editTask} disabled={isUpdateDisabled} >
                Save
              </Button>
              <Button color="gray" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* create Modal */}
      <Modal
      show={createModalOpen}
      size="md"
      onClose={() => setCreateModalOpen(false)}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Add Task
          </h3>
          <div className="flex flex-col gap-4">
            {/* Title Field */}
            <div>
              <Label htmlFor="title" value="Title" />
              <TextInput
                id="title"
                type="text"
                value={newTask?.title || ""}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    title: e.target.value,
                  })
                }
              />
              {errors.title && <p className="text-red-600">{errors.title}</p>}
            </div>

            {/* Description Field */}
            <div>
              <Label htmlFor="description" value="Description" />
              <Textarea
                id="description"
                value={newTask?.description || ""}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    description: e.target.value,
                  })
                }
              />
              {errors.description && <p className="text-red-600">{errors.description}</p>}
            </div>

            {/* Assign To User Field */}
            <div>
              <Label htmlFor="user" value="Assign To" />
              <Select
                id="user"
                value={newTask?.user}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    user: e.target.value,
                  })
                }
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </Select>
              {errors.user && <p className="text-red-600">{errors.user}</p>}
            </div>

            {/* Status Field */}
            <div>
              <Label htmlFor="status" value="Status" />
              <Select
                id="status"
                value={newTask?.status}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    status: e.target.value,
                  })
                }
              >
                <option value="">Select Status</option>
                <option value="todo">To-Do</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
              </Select>
              {errors.status && <p className="text-red-600">{errors.status}</p>}
            </div>

            {/* Priority Field */}
            <div>
              <Label htmlFor="priority" value="Priority" />
              <Select
                id="priority"
                value={newTask?.priority}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    priority: e.target.value,
                  })
                }
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
              {errors.priority && <p className="text-red-600">{errors.priority}</p>}
            </div>

            {/* Due Date Field */}
            <div>
              <Label htmlFor="due_date" value="Due Date" />
              <input
                id="due_date"
                type="date"
                value={newTask?.due_date || ""}
                min={new Date().toISOString().split("T")[0]}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    due_date: e.target.value,
                  })
                }
              />
              {errors.due_date && <p className="text-red-600">{errors.due_date}</p>}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <Button color="success" onClick={createTask} disabled={isSaveDisabled}>
              Save
            </Button>
            <Button color="gray" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
     
    </>
  );
};

export default Home;
