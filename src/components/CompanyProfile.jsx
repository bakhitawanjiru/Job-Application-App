import { useState, useEffect } from 'react';
import { useAuth } from './Auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '/config/firebase';
import Sidebar from './Sidebar';

const CompanyProfile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    size: '',
    founded: '',
    logo: '',
    isPublished: false,
    publishedAt: null 
  });

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const docRef = doc(db, 'public_companies', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCompanyInfo(docSnap.data());
        }
      } catch (err) {
        setError('Failed to load company profile');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [currentUser]);


  const handleChange = (e) => {
    setCompanyInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
     
      const companyData = {
        employerId: currentUser.uid,
        name: companyInfo.name || '',
        location: companyInfo.location || '',
        description: companyInfo.description || '',
        website: companyInfo.website || '',
        industry: companyInfo.industry || '',
        size: companyInfo.size || '',
        logo: companyInfo.logo || '',
        founded: companyInfo.founded || '',
        isPublished: companyInfo.isPublished || false,
        publishedAt: companyInfo.isPublished ? new Date().toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      Object.keys(companyData).forEach(key => 
        (companyData[key] === undefined || companyData[key] === null) && delete companyData[key]
      );

      const companyRef = doc(db, "public_companies", currentUser.uid);
      await setDoc(companyRef, companyData);

      setSuccess("Company profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {console.error("Error saving company profile:", err);
      setError("Failed to update company profile: " + err.message);
      setTimeout(() => setError(""), 3000);
    } finally {
    setSaving(false); // Add this line
  }
};
    
      
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="flex">
        <Sidebar userType="employer" />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-[#4682B4] mb-8">Company Profile</h1>
            
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          
{success && (
  <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
    {success}
  </div>
)}

            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    name="name"
                    value={companyInfo.name}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={companyInfo.description}
                    onChange={handleChange}
                    rows="4"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={companyInfo.industry}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={companyInfo.location}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={companyInfo.website}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Size</label>
                  <select
                    name="size"
                    value={companyInfo.size}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Founded Year</label>
                  <input
                    type="number"
                    name="founded"
                    value={companyInfo.founded}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    placeholder="YYYY"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
  <div className="flex items-center">
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={companyInfo.isPublished}
        onChange={(e) => setCompanyInfo(prev => ({
          ...prev,
          isPublished: e.target.checked
        }))}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4682B4]"></div>
      <span className="ml-3 text-sm font-medium text-gray-700">
        {companyInfo.isPublished ? 'Published' : 'Draft'}
      </span>
    </label>
  </div>
  <button
    type="submit"
    disabled={saving}
    className="bg-[#4682B4] text-white px-4 py-2 rounded-md hover:bg-[#4682B4]/90 disabled:opacity-50"
  >
    {saving ? 'Saving...' : 'Save Changes'}
  </button>
</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;