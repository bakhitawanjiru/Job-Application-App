import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '/config/firebase';
import Sidebar from './Sidebar';
import { MdDelete, MdEdit, MdBusiness, MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const ManageCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    industry: '',
    location: '',
    status: 'active'
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesQuery = query(collection(db, 'companies'));
        const querySnapshot = await getDocs(companiesQuery);
        
        const companiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setCompanies(companiesData);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleEdit = (company) => {
    setEditingCompany(company);
    setEditForm({
      name: company.name || '',
      industry: company.industry || '',
      location: company.location || '',
      status: company.status || 'active'
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    try {
      const companyRef = doc(db, 'companies', editingCompany.id);
      await updateDoc(companyRef, editForm);
      
      setCompanies(companies.map(company => 
        company.id === editingCompany.id ? { ...company, ...editForm } : company
      ));
      
      setIsEditModalOpen(false);
      setEditingCompany(null);
    } catch (err) {
      console.error('Error updating company:', err);
      setError('Failed to update company');
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await deleteDoc(doc(db, 'companies', companyId));
        setCompanies(companies.filter(company => company.id !== companyId));
      } catch (err) {
        console.error('Error deleting company:', err);
        setError('Failed to delete company');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="flex">
        <Sidebar userType="admin" />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-[#4682B4]">Manage Companies</h1>
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="flex items-center px-4 py-2 text-sm text-[#4682B4] hover:bg-[#4682B4]/10 rounded-md"
              >
                <MdArrowBack className="mr-2" />
                Back to Dashboard
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-4">Loading companies...</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Industry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companies.map((company) => (
                      <tr key={company.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MdBusiness className="text-gray-500 mr-2 text-xl" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {company.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {company.industry}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {company.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${company.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {company.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(company)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <MdEdit className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleDeleteCompany(company.id)}
                            className="text-red-600 hover:text-red-900"
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

      {isEditModalOpen && editingCompany && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Company
              </h3>
              <form onSubmit={handleUpdateCompany} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={editForm.industry}
                    onChange={(e) => setEditForm({...editForm, industry: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
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

export default ManageCompanies;