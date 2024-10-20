'use client';

import axios from "axios";
import {
    Button,
    Card,
    Label,
    Modal,
    Pagination,
    Table,
    TextInput
} from "flowbite-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import {
    HiOutlineExclamationCircle,
    HiPlusCircle
} from "react-icons/hi";
import { IoIosRefreshCircle } from "react-icons/io";
import { RiDeleteBin6Fill } from "react-icons/ri";
import * as yup from "yup";

interface UserData {
  name: string;
  email: string;
  username: string;
  _id: any;
  tasks: any;
}

const userSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  username: yup.string().required("Username is required"),
});

const UserList = () => {
  const [data, setData] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  const [itemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState<
    UserData | { name: string; email: string; username: string }
  >({ name: "", email: "", username: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const userDetails = async () => {
    try {

      const response = await axios.post("/api/users/list", null, 
      );
        setLoading(false);
      setData(response?.data?.data);
    } catch (error: any) {
      console.error(error.message || "Error fetching user details");
      toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    userDetails()
  }, []);

  // Delete user
  const deleteUser = async () => {
    if (!userIdToDelete) return;

    try {
    
      const response = await axios.delete(
        `/api/users/delete/${userIdToDelete}`,
        
      );
      await userDetails();
      toast.success("User deleted successfully");
      setDeleteModalOpen(false);
      setUserIdToDelete(null);
    } catch (error: any) {
      console.error(error.message || "Error deleting user");
      toast.error(error.response.data.error);
    }
  };

  // Edit user
  // const editUser = async () => {
  //   if (!userToEdit) return;

  //   try {
     
  //     const response = await axios.put(
  //       `/api/users/update/${userToEdit._id}`,
  //       userToEdit,
       
  //     );
  //     await userDetails();
  //     toast.success("User updated successfully");
  //     setEditModalOpen(false);
  //     setUserToEdit(null);
  //   } catch (error: any) {
  //     console.error(error.message || "Error updating user");
  //     toast.error("Failed to update user");
  //   }
  // };

  const editUser = async () => {
    if (!userToEdit) return;
  
    try {
      await userSchema.validate(userToEdit, { abortEarly: false });
      setIsUpdateDisabled(true);
  
      // Perform the update request
      const response = await axios.put(
        `/api/users/update/${userToEdit._id}`,
        userToEdit
      );
  
      // Refresh user details after the update
      await userDetails();
  
      // Display success message and reset the form
      toast.success("User updated successfully");
      setEditModalOpen(false);
      setUserToEdit(null);
      setErrors({});
    } catch (error: any) {
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
  

  // Create user
  const createUser = async () => {
    try {

      await userSchema.validate(newUser, { abortEarly: false });
  
      setIsSaveDisabled(true);


      const response = await axios.post(`/api/users/create`, newUser);
      await userDetails();
      toast.success("User created successfully");
      setCreateModalOpen(false);
      setNewUser({ name: "", email: "", username: "" });
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
  

  // Get current data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredData = data.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const serialNumber = indexOfFirstItem + 1;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle delete button click
  const handleDeleteClick = (id: string) => {
    setUserIdToDelete(id);
    setDeleteModalOpen(true);
  };

  // Handle edit button click
  const handleEditClick = (user: UserData) => {
    setUserToEdit(user);
    setEditModalOpen(true);
  };

  // Handle create button click
  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  const disableIFEmpty = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regex.test(newUser?.email)) {

      return newUser?.name && newUser?.username && newUser?.email;
    }
  }
  const disableIFEmptyEdit = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regex.test(userToEdit?.email!)) {

      return userToEdit?.name && userToEdit?.username && userToEdit?.email;
    }
  }

  return (
    <>
      <div>
        <div className="p-4">
          <h1 className="my-10 ml-7 text-xl font-semibold dark:text-white">
          User List
            <div className="float-right rtl:float-left">
            <div className="flex space-x-2 rtl:space-x-reverse">
                <Button color="gray" onClick={handleCreateClick}>
                  <HiPlusCircle className="mr-2 h-5 w-5" />
                 Add User
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    userDetails;
                    toast.success("User list refreshed successfully");
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
          <div className="overflow-x-auto">
            <Table striped={true}>
              <Table.Head>
                <Table.HeadCell>#</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>No. of Tasks</Table.HeadCell>

                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {loading
                  ? [...Array(itemsPerPage)].map((_, index) => (
                      <Table.Row
                        key={index}
                        className="bg-white dark:bg-gray-800"
                      >
                        <Table.Cell>
                          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  : currentData.map((user, index) => (
                      <Table.Row
                        key={index}
                        className="bg-white dark:bg-gray-800"
                      >
                        <Table.Cell>{serialNumber + index}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                        <Table.Cell>{user.tasks.length}</Table.Cell>
                        
                        <Table.Cell className="flex flex-wrap gap-2">
                          <Button
                            color="blue"
                            pill
                            onClick={() => handleEditClick(user)}
                           
                            size={"sm"}
                          >
                            <FaEdit size={"sm"} className="mr-2 h-5 w-5" />
                          Edit
                          </Button>
                          <Button
                            color="failure"
                            pill
                            onClick={() => handleDeleteClick(user._id)}
                            size={"sm"}
                          >
                            <RiDeleteBin6Fill
                              size={"sm"}
                              className="mr-2 h-5 w-5"
                            />
                           Delete
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
              </Table.Body>
            </Table>
          </div>
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          </div>
        </div>
      </div>

      {/* Delete User Modal */}
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
              <Button color="failure" onClick={deleteUser}>
                Yes
              </Button>
              <Button color="gray" onClick={() => setDeleteModalOpen(false)}>
               No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit User Modal */}
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
                <Label htmlFor="name" value= 'Name' />
                <TextInput
                  id="name"
                  type="text"
                  value={userToEdit?.name || ""}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      name: e.target.value,
                    } as UserData)
                  }
                />
                {errors.name && ( <p className="text-red-600">{errors.name}</p>)}
              </div>
              <div>
                <Label htmlFor="email" value='Email' />
                <TextInput
                  id="email"
                  type="email"
                  value={userToEdit?.email || ""}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      email: e.target.value,
                    } as UserData)
                  }
                />
                {errors.email && ( <p className="text-red-600">{errors.email}</p>)}
              </div>
              <div>
                <Label htmlFor="username" value='Username' />
                <TextInput
                  id="username"
                  type="text"
                  value={userToEdit?.username || ""}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      username: e.target.value,
                    } as UserData)
                  }
                />
                {errors.username && ( <p className="text-red-600">{errors.username}</p>)}
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button color="success"  disabled={isUpdateDisabled} onClick={editUser}>
               Save
              </Button>
              <Button color="gray" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Create User Modal */}
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
            Add User
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="newName" value='Name' />
                <TextInput
                  id="newName"
                  type="text"
                  value={newUser.name || ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      name: e.target.value,
                    } as UserData)
                  }
                />
                {errors.name && ( <p className="text-red-600">{errors.name}</p>)}
              </div>
              <div>
                <Label htmlFor="newEmail" value='Email' />
                <TextInput
                  id="newEmail"
                  type="email"
                  value={newUser.email || ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      email: e.target.value,
                    } as UserData)
                  }
                />
                {errors.email && ( <p className="text-red-600">{errors.email}</p>)}
              </div>
              <div>
                <Label htmlFor="newUsername" value='Username' />
                <TextInput
                  id="newUsername"
                  type="text"
                  value={newUser.username || ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      username: e.target.value,
                    } as UserData)
                  }
                />
                {errors.username && ( <p className="text-red-600">{errors.username}</p>)}
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button color="success"   disabled={isSaveDisabled} onClick={createUser}>
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

export default UserList;
