import { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "/config/firebase";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit, MdBlock } from "react-icons/md";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    userType: '',
    status: ''
  });
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      userType: user.userType || '',
      status: user.status || 'active'
    });
    setIsEditModalOpen(true);
  };
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, editForm);
      
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...editForm } : user
      ));
      
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersQuery = query(collection(db, "users"));
        const querySnapshot = await getDocs(usersQuery);

        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: doc.data().status || "active",
          createdAt: doc.data().createdAt || new Date().toISOString(),
        }));

        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { status: newStatus });

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Failed to delete user");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="flex">
        <Sidebar userType="admin" />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-[#4682B4] mb-8">
              Manage Users
            </h1>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-4">Loading users...</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {user.userType}
                          </span>
                        </td>
                        
                      
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
    onClick={() => handleEdit(user)}
    className="text-blue-600 hover:text-blue-900 mr-3"
  >
    <MdEdit className="text-xl" />
  </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 mr-3"
                          >
                            <MdDelete className="text-xl" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

{isEditModalOpen && editingUser && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div className="mt-3">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Edit User
        </h3>
        <form onSubmit={handleUpdateUser} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={editForm.userType}
              onChange={(e) => setEditForm({...editForm, userType: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4682B4] text-white rounded-md hover:bg-[#4682B4]/90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ManageUsers;
