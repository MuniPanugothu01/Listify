// ModernProfile.jsx (Main Wrapper Component)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  X, 
  Menu,
  FileText,
  Heart
} from "lucide-react";

import Sidebar from "../UserProfile/Sidebar";
import RightProfileSection from "../UserProfile/RightProfileSection";
import HomeSection from "../UserProfile/HomeSection";
import MessagesSection from "../UserProfile/MessagesSection";
import PersonalDetailsSection from "../UserProfile/PersonalDetailsSection";
import PropertyCard from "../UserProfile/PropertyCard";
import SmallProfileHeader from "../UserProfile/SmallProfileHeader";

export default function ModernProfile() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, San Francisco, CA",
    isLoggedIn: true,
    status: "Available"
  });
  const [savedHouses, setSavedHouses] = useState([
    {
      id: 1,
      title: "Modern Downtown Apartment",
      description: "Beautiful 2-bedroom apartment in the heart of downtown with amazing city views",
      location: "Downtown, San Francisco, CA",
      price: 2500,
      type: "rent",
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"],
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Luxury Villa with Pool",
      description: "Stunning 4-bedroom villa with private pool and garden",
      location: "Palo Alto, CA",
      price: 850000,
      type: "sale",
      images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop"],
      posted: "1 week ago"
    }
  ]);
  const [myPosts, setMyPosts] = useState([
    {
      id: 3,
      title: "Cozy Family Home",
      description: "3 bedroom family home in quiet neighborhood with spacious backyard",
      location: "Suburbia, CA",
      price: 650000,
      type: "sale",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"],
      posted: "3 days ago"
    },
    {
      id: 4,
      title: "Modern Studio Apartment",
      description: "Compact studio with modern amenities in city center",
      location: "Urban District, CA",
      price: 1200,
      type: "rent",
      bedrooms: 0,
      bathrooms: 1,
      sqft: 500,
      images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=300&fit=crop"],
      posted: "1 week ago"
    }
  ]);
  const [myAlerts, setMyAlerts] = useState([]);
  const [messages, setMessages] = useState([
    { name: "Alice Brown", preview: "Interested in the downtown apartment...", time: "11:01", unread: true, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" },
    { name: "Bob Smith", preview: "Thanks for the update on villa...", time: "09:38", unread: false, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
    { name: "Carol Johnson", preview: "Scheduling a viewing...", time: "09:38", unread: false, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load user details from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.profilePic) {
          setProfilePicPreview(parsedUser.profilePic);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    setEditData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
    });
  }, [user]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreview = reader.result;
        setProfilePicPreview(newPreview);
        setEditData({ ...editData, profilePic: newPreview });
        // Update user in localStorage
        const updatedUser = { ...user, profilePic: newPreview };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...editData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
  };

  const toggleSave = (house) => {
    setSavedHouses(savedHouses.filter(h => h.id !== house.id));
  };

  const counts = {
    posts: myPosts.length,
    saved: savedHouses.length,
    alerts: myAlerts.length
  };

  // Mock data for home section
  const agendaEvents = {
    2: [ // Wednesday
      { title: "Group Viewing Tour", time: "12:30-1:30", group: true, avatars: ["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=20&h=20", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=20&h=20", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=20&h=20"] },
      { title: "Viewing with T. Morgan", time: "1:40-1:45", client: "T. Morgan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" }
    ],
    3: [ // Thursday
      { title: "Viewing with S. Green", time: "1:30-1:45", client: "S. Green", avatar: "https://images.unsplash.com/photo-1524504388940-b8e918bb7c5c?w=24&h=24&fit=crop&crop=face" }
    ]
  };

  const viewingRequests = [
    { client: "James Patel", time: "Today, 3:00", type: "Apartment Viewing", status: "Approved", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
    { client: "Hannah Collins", time: "Tomorrow, 6:30", type: "Villa Tour", status: "Pending", avatar: "https://images.unsplash.com/photo-1524504388940-b8e918bb7c5c?w=40&h=40&fit=crop&crop=face" },
    { client: "Sara Kim", time: "Fri, 10:00", type: "Property Inspection", status: "Declined", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" }
  ];

  const handleViewAll = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white shadow-md border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 " /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 
              className="text-xl font-bold text-[#2F3A63] sm:text-2xl flex-shrink-0 cursor-pointer hover:text-[#5669A4] transition-colors"
              onClick={() => navigate('/')}
            >
              Listify
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveSection('alerts')}
              className="relative p-2 rounded-full hover:bg-gray-100/50 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {counts.alerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2F3A63] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {counts.alerts > 99 ? '99+' : counts.alerts}
                </span>
              )}
            </button>
            <SmallProfileHeader profilePic={profilePicPreview} />
          </div>
        </div>
      </header>

      <div className="pt-16 container mx-auto px-4 py-6 mt-4">
        <div className="flex lg:flex-row gap-6">
          <Sidebar 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            counts={counts}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          
          <main className="flex-1 lg:mr-6 space-y-6 w-full ">
            {activeSection === "home" && (
              <HomeSection
                savedHouses={savedHouses}
                myPosts={myPosts}
                myAlerts={myAlerts}
                messages={messages}
                agendaEvents={agendaEvents}
                viewingRequests={viewingRequests}
                onViewAll={handleViewAll}
              />
            )}

            {activeSection === "messages" && (
              <MessagesSection messages={messages} />
            )}

            {activeSection === "personal" && (
              <PersonalDetailsSection
                user={user}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editData={editData}
                setEditData={setEditData}
                profilePicPreview={profilePicPreview}
                handleProfilePicChange={handleProfilePicChange}
                handleSave={handleSave}
                handleCancel={handleCancel}
              />
            )}

            {activeSection === "saved" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Saved Items</h2>
                  <p className="text-sm text-gray-500 mt-1">{savedHouses.length} properties saved</p>
                </div>
                {savedHouses.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved items yet</h3>
                    <p className="text-gray-600 mb-6">Start saving properties you love!</p>
                    <button className="px-6 py-3 bg-[#2F3A63] text-white rounded-xl hover:bg-[#5669A4] transition-colors font-medium shadow-md hover:shadow-lg">
                      Browse Properties
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {savedHouses.map((house) => (
                      <PropertyCard 
                        key={house.id} 
                        property={house} 
                        onToggleSave={toggleSave}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "posts" && (
              <div>
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Posts ({myPosts.length})</h2>
                  <button className="px-6 py-3 bg-[#2F3A63] text-white rounded-xl hover:bg-[#5669A4] transition-colors font-medium shadow-md hover:shadow-lg w-full sm:w-auto">
                    Post New Ad
                  </button>
                </div>
                {myPosts.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-6">Create your first listing!</p>
                    <button className="px-6 py-3 bg-[#2F3A63] text-white rounded-xl hover:bg-[#5669A4] transition-colors font-medium shadow-md hover:shadow-lg">
                      Post New Ad
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {myPosts.map((post) => (
                      <PropertyCard 
                        key={post.id} 
                        property={post} 
                        isMyPost={true}
                        onToggleSave={() => {}}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "settings" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Settings</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates about new listings</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#A9E4FB]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2F3A63]"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "alerts" && (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No alerts yet</h3>
                <p className="text-gray-600 mb-6">Set up alerts for new listings!</p>
                <button className="px-6 py-3 bg-[#2F3A63] text-white rounded-xl hover:bg-[#5669A4] transition-colors font-medium shadow-md hover:shadow-lg">
                  Set Up Alert
                </button>
              </div>
            )}

            {activeSection === "activity" && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:text-3xl">Account Activity</h2>
                <p className="text-gray-600">Recent activity will be shown here.</p>
              </div>
            )}

            {activeSection === "security" && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:text-3xl">Security</h2>
                <p className="text-gray-600">Security settings will be managed here.</p>
              </div>
            )}
          </main>

          {/* Right Profile Section */}
          <RightProfileSection 
            user={user} 
            profilePic={profilePicPreview} 
            myPosts={myPosts} 
            onToggleSave={toggleSave} 
          />
        </div>
      </div>
    </div>
  );
}