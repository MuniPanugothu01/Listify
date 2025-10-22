// DiscussionForumsList.js (Fixed)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Heart } from "lucide-react";

// Import your JSON data
import data from "../data/data.json";

function DiscussionForumsList() {
  const forums = data.discussionForums || [];
  const [savedItems, setSavedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [authorFilter, searchTerm]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
    setSavedItems(saved);
  }, []);

  useEffect(() => {
    const loadSaved = () => {
      const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
      setSavedItems(saved);
    };

    window.addEventListener('savedItemsChanged', loadSaved);
    return () => window.removeEventListener('savedItemsChanged', loadSaved);
  }, []);

  const toggleSave = (forum) => {
    let newSaved;
    const isSaved = savedItems.some(i => i.id === forum.id);
    if (isSaved) {
      newSaved = savedItems.filter(i => i.id !== forum.id);
    } else {
      newSaved = [...savedItems, forum];
    }
    setSavedItems(newSaved);
    localStorage.setItem('savedItems', JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent('savedItemsChanged'));
  };

  // Get unique authors for the author filter
  const uniqueAuthors = [...new Set((forums || []).map((forum) => forum?.author).filter(Boolean))];

  const filteredForums = (forums || []).filter((forum) => {
    const title = forum?.title || '';
    const author = forum?.author || '';
    const description = forum?.description || '';

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAuthor = authorFilter === "" || author === authorFilter;

    return matchesSearch && matchesAuthor;
  });

  const indexOfLastForum = currentPage * itemsPerPage;
  const indexOfFirstForum = indexOfLastForum - itemsPerPage;
  const currentForums = filteredForums.slice(indexOfFirstForum, indexOfLastForum);
  const totalPages = Math.ceil(filteredForums.length / itemsPerPage);

  const startIndex = indexOfFirstForum + 1;
  const endIndex = Math.min(indexOfLastForum, filteredForums.length);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Wallpaper */}
      <div
        className="relative h-[80vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1593642532973-d31b6557fa68?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discussion Forums
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Join and participate in community discussions.
            </p>
          </div>
        </div>

        {/* Search and Filter Section Overlay */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-10 max-w-5xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-2xl p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                {/* Author Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Author
                  </label>
                  <div className="relative">
                    <select
                      value={authorFilter}
                      onChange={(e) => setAuthorFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                      <option value="">All Authors</option>
                      {uniqueAuthors.map((author, index) => (
                        <option key={index} value={author}>
                          {author}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {/* Search Button */}
                <div>
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 pt-20 pb-8 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Back to Categories Button */}
          <div className="mb-6">
            <Link
              to="/categories"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg inline-block hover:bg-blue-600 transition-colors w-full sm:w-auto text-center sm:text-left"
            >
              Back to Categories
            </Link>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Community Discussions
              </h2>
              <p className="text-gray-600 mt-1">
                Showing {startIndex}-{endIndex} of {filteredForums.length} topics
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Filters Applied</span>
            </div>
          </div>

          {/* Forums Grid */}
          {filteredForums.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-xl mb-2">No topics found</p>
              <p className="text-gray-500 mb-4">
                Try adjusting your search filters
              </p>
              <button
                onClick={() => {
                  setAuthorFilter("");
                  setSearchTerm("");
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {currentForums.map((forum) => {
                  const isSaved = savedItems.some(i => i.id === forum.id);
                  return (
                    <div
                      key={forum.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative">
                        <img
                          src={forum.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={forum.title || 'Untitled'}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            {forum.comments || 0} comments
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                            {forum.posted || 'Unknown'}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSave(forum);
                            }}
                            className="p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
                          >
                            <Heart 
                              className={`w-4 h-4 transition-colors ${
                                isSaved 
                                  ? 'fill-red-600 text-red-600' 
                                  : 'text-gray-400 hover:text-red-500'
                              }`} 
                            />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                          {forum.title || 'Untitled Discussion'}
                        </h3>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {forum.description || 'No description provided.'}
                        </p>

                        <div className="text-sm text-gray-500 mb-4">
                          By {forum.author || 'Unknown'}
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/categories/discussion-forums/${forum.id}`}
                            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            View Discussion
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center space-x-2 mt-8 gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiscussionForumsList;