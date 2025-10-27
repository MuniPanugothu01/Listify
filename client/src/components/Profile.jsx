import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, 
  Settings, 
  Heart, 
  Shield, 
  LogOut, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  ChevronRight,
  FileText,
  Bed,
  Bath,
  Square,
  DollarSign,
  Bell,
  Activity,
  Camera
} from "lucide-react";

function Profile() {
  const [activeSection, setActiveSection] = useState("personal");
  const [user, setUser] = useState(null);
  const [savedHouses, setSavedHouses] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [myAlerts, setMyAlerts] = useState([]);
  const [accountActivity, setAccountActivity] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [profilePic, setProfilePic] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    privacy: "public",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.isLoggedIn) {
      setUser(storedUser);
      setEditData({
        name: storedUser.name || '',
        email: storedUser.email || '',
        phone: storedUser.phone || '',
        address: storedUser.address || '',
      });
      setProfilePic(storedUser.profilePic || "");
      setProfilePicPreview(storedUser.profilePicPreview || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48&q=80");
    } else {
      navigate('/signin');
    }

    const loadSaved = () => {
      const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
      setSavedHouses(saved);
    };
    loadSaved();
    window.addEventListener('savedItemsChanged', loadSaved);
    const cleanupSaved = () => window.removeEventListener('savedItemsChanged', loadSaved);

    const loadMyPosts = () => {
      const posts = JSON.parse(localStorage.getItem('myPosts') || '[]');
      setMyPosts(posts);
    };
    loadMyPosts();
    window.addEventListener('myPostsChanged', loadMyPosts);
    const cleanupPosts = () => window.removeEventListener('myPostsChanged', loadMyPosts);

    // Mock alerts and activity
    setMyAlerts([
      { id: 1, search: "2 bedroom apartments under $1500", category: "housing", active: true, created: "2025-10-20" },
      { id: 2, search: "used cars under $10k", category: "cars", active: false, created: "2025-10-15" },
    ]);
    setAccountActivity([
      { id: 1, action: "Login", date: "2025-10-27 09:30 AM", ip: "192.168.1.1" },
      { id: 2, action: "Posted ad", date: "2025-10-26 02:15 PM", ip: "192.168.1.1" },
      { id: 3, action: "Saved item", date: "2025-10-25 11:45 AM", ip: "192.168.1.2" },
    ]);

    return () => {
      cleanupSaved();
      cleanupPosts();
    };
  }, [navigate]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setProfilePicPreview(base64);
        setEditData({ ...editData, profilePic: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSavePersonal = () => {
    const updatedUser = { ...user, ...editData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setProfilePic(updatedUser.profilePic || "");
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      profilePic: user.profilePic || "",
    });
    setProfilePicPreview(user.profilePicPreview || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48&q=80");
  };

  const toggleSave = (house) => {
    const newSaved = savedHouses.filter(h => h.id !== house.id);
    setSavedHouses(newSaved);
    localStorage.setItem('savedItems', JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent('savedItemsChanged'));
  };

  const toggleAlert = (alertId) => {
    setMyAlerts(myAlerts.map(alert => 
      alert.id === alertId ? { ...alert, active: !alert.active } : alert
    ));
  };

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-[#2F3A63] hover:text-[#2F3A63]/80 font-medium"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </button>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          {isEditing && (
            <div className="flex items-center">
              <Camera className="w-5 h-5 text-gray-500 mr-3" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <div className="flex items-center space-x-4">
                  <img 
                    src={profilePicPreview} 
                    alt="Profile Preview" 
                    className="w-20 h-20 rounded-full object-cover" 
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2F3A63]/10 file:text-[#2F3A63] hover:file:bg-[#2F3A63]/20"
                  />
                </div>
              </div>
            </div>
          )}
          {!isEditing && (
            <div className="flex items-center">
              <img 
                src={profilePicPreview} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover mr-4" 
              />
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-900">Profile Photo</p>
              </div>
            </div>
          )}
          <div className="flex items-center">
            <User className="w-5 h-5 text-gray-500 mr-3" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2F3A63]"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900">{editData.name}</p>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-gray-500 mr-3" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2F3A63]"
                />
              ) : (
                <p className="text-lg text-gray-900">{editData.email}</p>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 text-gray-500 mr-3" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2F3A63]"
                />
              ) : (
                <p className="text-lg text-gray-900">{editData.phone}</p>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-gray-500 mr-3" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditing ? (
                <textarea
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2F3A63]"
                />
              ) : (
                <p className="text-lg text-gray-900">{editData.address}</p>
              )}
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSavePersonal}
              className="bg-[#2F3A63] text-white py-2 px-4 rounded-md hover:bg-[#2F3A63]/90 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
            <p className="text-sm text-gray-500">Receive updates about new listings and saved items.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2F3A63]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2F3A63]"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Updates</label>
            <p className="text-sm text-gray-500">Get weekly summaries of market trends.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailUpdates}
              onChange={(e) => setSettings({ ...settings, emailUpdates: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2F3A63]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2F3A63]"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">Privacy Level</label>
            <p className="text-sm text-gray-500">Control who can see your profile.</p>
          </div>
          <select
            value={settings.privacy}
            onChange={(e) => setSettings({ ...settings, privacy: e.target.value })}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#2F3A63]"
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <Link to="/help" className="text-[#2F3A63] hover:underline text-sm">
            Help & FAQ
          </Link>
        </div>
      </div>
    </div>
  );

  const renderSavedItems = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Saved Items ({savedHouses.length})</h2>
      {savedHouses.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No saved items yet. Start saving properties you love!</p>
          <Link 
            to="/categories/houses" 
            className="bg-[#2F3A63] text-white py-2 px-6 rounded-lg hover:bg-[#2F3A63]/90 transition-colors inline-block mt-4"
          >
            Browse Houses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedHouses.map((house) => (
            <div
              key={house.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={house.images[0]}
                  alt={house.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    house.type === "rent"
                      ? "bg-[#2F3A63]/10 text-[#2F3A63]"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {house.type === "rent" ? "For Rent" : "For Sale"}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => toggleSave(house)}
                    className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {house.posted}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {house.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {house.description}
                </p>
                <div className="flex items-center text-gray-500 mb-3 text-sm">
                  <MapPin className="w-4 h-4 mr-1 text-[#2F3A63]" />
                  <span>{house.location.split(",")[0]}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-green-600">
                    {house.type === "rent"
                      ? `$${house.price}/mo`
                      : `$${house.price.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/categories/houses/${house.id}`}
                    className="flex-1 bg-[#2F3A63] text-white text-center py-2 px-3 rounded-lg hover:bg-[#2F3A63]/90 transition-colors font-medium text-sm"
                  >
                    View Details
                  </Link>
                  <a
                    href={`mailto:${house.contactEmail}?subject=Inquiry about ${house.title}`}
                    className="flex-1 border border-[#2F3A63] text-[#2F3A63] text-center py-2 px-3 rounded-lg hover:bg-[#2F3A63]/5 transition-colors font-medium text-sm"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMyPosts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">My Posted Ads ({myPosts.length})</h2>
        <Link 
          to="/postadd" 
          className="bg-[#2F3A63] text-white py-2 px-6 rounded-lg hover:bg-[#2F3A63]/90 transition-colors flex items-center font-medium"
        >
          <FileText className="w-4 h-4 mr-2" />
          Post New Ad
        </Link>
      </div>
      {myPosts.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No ads posted yet. Start posting your listings!</p>
          <Link 
            to="/postadd" 
            className="bg-[#2F3A63] text-white py-2 px-6 rounded-lg hover:bg-[#2F3A63]/90 transition-colors inline-block mt-4"
          >
            Post Ad
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {myPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.type === "rent"
                      ? "bg-[#2F3A63]/10 text-[#2F3A63]"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {post.type === "rent" ? "For Rent" : "For Sale"}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Posted by You
                  </span>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {post.posted}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {post.description}
                </p>
                <div className="flex items-center text-gray-500 mb-3 text-sm">
                  <MapPin className="w-4 h-4 mr-1 text-[#2F3A63]" />
                  <span>{post.location.split(",")[0]}</span>
                </div>
                <div className="flex items-center justify-between text-gray-500 mb-3 text-sm">
                  <div className="flex items-center">
                    <Bed className="w-3 h-3 mr-1 text-[#2F3A63]" />
                    <span>{post.bedrooms || 2} beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-3 h-3 mr-1 text-[#2F3A63]" />
                    <span>{post.bathrooms || 1} baths</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-3 h-3 mr-1 text-[#2F3A63]" />
                    <span>{post.sqft} sqft</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-green-600">
                    {post.type === "rent"
                      ? `$${post.price}/mo`
                      : `$${post.price.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/categories/houses/${post.id}`}
                    className="flex-1 bg-[#2F3A63] text-white text-center py-2 px-3 rounded-lg hover:bg-[#2F3A63]/90 transition-colors font-medium text-sm"
                  >
                    Edit Ad
                  </Link>
                  <button
                    onClick={() => {
                      // Simulate delete
                      const newPosts = myPosts.filter(p => p.id !== post.id);
                      setMyPosts(newPosts);
                      localStorage.setItem('myPosts', JSON.stringify(newPosts));
                      window.dispatchEvent(new CustomEvent('myPostsChanged'));
                    }}
                    className="flex-1 bg-red-600 text-white text-center py-2 px-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Alerts ({myAlerts.length})</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {myAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No alerts set up yet. Create alerts for new listings!</p>
            <Link 
              to="/search" 
              className="bg-[#2F3A63] text-white py-2 px-6 rounded-lg hover:bg-[#2F3A63]/90 transition-colors inline-block mt-4"
            >
              Set Up Alert
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{alert.search}</p>
                  <p className="text-sm text-gray-500">{alert.category} • Created: {alert.created}</p>
                </div>
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    alert.active
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {alert.active ? "Active" : "Inactive"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Account Activity</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accountActivity.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {accountActivity.length === 0 && (
          <p className="text-center text-gray-500 py-8">No recent activity.</p>
        )}
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Security</h2>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">Change Password</label>
            <p className="text-sm text-gray-500">Update your account password for security.</p>
          </div>
          <button className="bg-[#2F3A63] text-white py-2 px-4 rounded-md hover:bg-[#2F3A63]/90 transition-colors">
            Change Password
          </button>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Last login: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );

  const sections = {
    personal: renderPersonalDetails(),
    settings: renderSettings(),
    saved: renderSavedItems(),
    posts: renderMyPosts(),
    alerts: renderAlerts(),
    activity: renderActivity(),
    security: renderSecurity(),
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-64 bg-white rounded-lg shadow-md p-4 lg:p-6 space-y-4">
            <div className="flex items-center space-x-3 mb-8">
              <img 
                src={profilePicPreview} 
                alt="Profile Avatar" 
                className="w-12 h-12 rounded-full object-cover flex-shrink-0" 
              />
              <div className="min-w-0 flex-1 hidden lg:block">
                <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="lg:hidden text-center flex-1">
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection("personal")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  activeSection === "personal"
                    ? "bg-[#2F3A63]/5 text-[#2F3A63]"
                    : "text-gray-700 hover:bg-[#2F3A63]/5"
                }`}
              >
                <User className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Personal Details</span>
              </button>
              <button
                onClick={() => setActiveSection("settings")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  activeSection === "settings"
                    ? "bg-[#2F3A63]/5 text-[#2F3A63]"
                    : "text-gray-700 hover:bg-[#2F3A63]/5"
                }`}
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Settings</span>
              </button>
              <button
                onClick={() => setActiveSection("posts")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  activeSection === "posts"
                    ? "bg-[#2F3A63]/5 text-[#2F3A63]"
                    : "text-gray-700 hover:bg-[#2F3A63]/5"
                }`}
              >
                <FileText className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">My Posts ({myPosts.length})</span>
              </button>
              <button
                onClick={() => setActiveSection("saved")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  activeSection === "saved"
                    ? "bg-[#2F3A63]/5 text-[#2F3A63]"
                    : "text-gray-700 hover:bg-[#2F3A63]/5"
                }`}
              >
                <Heart className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Saved Items ({savedHouses.length})</span>
              </button>
              <button
                onClick={() => setActiveSection("alerts")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  activeSection === "alerts"
                    ? "bg-[#2F3A63]/5 text-[#2F3A63]"
                    : "text-gray-700 hover:bg-[#2F3A63]/5"
                }`}
              >
                <Bell className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">My Alerts ({myAlerts.length})</span>
              </button>
              <button
                onClick={() => setActiveSection("activity")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  activeSection === "activity"
                    ? "bg-[#2F3A63]/5 text-[#2F3A63]"
                    : "text-gray-700 hover:bg-[#2F3A63]/5"
                }`}
              >
                <Activity className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Account Activity</span>
              </button>
              <button
                onClick={() => setActiveSection("security")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  activeSection === "security"
                    ? "bg-[#2F3A63]/5 text-[#2F3A63]"
                    : "text-gray-700 hover:bg-[#2F3A63]/5"
                }`}
              >
                <Shield className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Security</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Logout</span>
              </button>
            </nav>
          </div>
          {/* Right Content */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-4 lg:p-6">
            {sections[activeSection]}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;