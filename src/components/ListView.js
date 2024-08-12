import React, { useState, useEffect } from 'react';
import './ListView.css';

const ListView = () => {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editIndex, setEditIndex] = useState(-1);
    const [editMember, setEditMember] = useState({ full_name: '', full_email: '', role: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('https://saaheeleox.github.io/reactdata/member.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setMembers(data);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching data');
                setLoading(false);
            });
    }, []);

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditMember(members[index]);
    };

    const handleSave = () => {
        if (window.confirm("Are you sure you want to save the changes?")) {
            const updatedMembers = [...members];
            updatedMembers[editIndex] = editMember;
            setMembers(updatedMembers);
            setEditIndex(-1);
        }
    };

    const handleDelete = (index) => {
        if (window.confirm("Are you sure you want to delete this member?")) {
            const updatedMembers = members.filter((_, i) => i !== index);
            setMembers(updatedMembers);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    const exportToCSV = () => {
        const csvRows = [
            ['ID', 'Name', 'Email', 'Role'],
            ...members.map((member, index) => [
                index + 1,
                member.full_name,
                member.full_email,
                member.role
            ])
        ];

        const csvContent = 'data:text/csv;charset=utf-8,' 
            + csvRows.map(e => e.join(',')).join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'members_list.csv');
        document.body.appendChild(link);
        link.click();
    };

    const filteredMembers = members.filter(member => {
        const nameMatch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = member.full_email.toLowerCase().includes(searchTerm.toLowerCase());
        const roleMatch = member.role.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || emailMatch || roleMatch;
    });

    const indexOfLastMember = currentPage * itemsPerPage;
    const indexOfFirstMember = indexOfLastMember - itemsPerPage;
    const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container">
            <h1 className="title">Members List View</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                    id="search-input"
                />
            </div>
            <div className="pagination-controls">
                <label htmlFor="itemsPerPage">Items per page: </label>
                <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
            </div>
            <div className="export-controls">
                <button onClick={exportToCSV}>Export as CSV</button>
            </div>
            {filteredMembers.length === 0 ? (
                <div>No members found.</div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMembers.map((member, index) => (
                                <tr key={index}>
                                    <td>{indexOfFirstMember + index + 1}</td>
                                    <td>
                                        {editIndex === indexOfFirstMember + index ? (
                                            <input
                                                type="text"
                                                value={editMember.full_name}
                                                onChange={(e) => setEditMember({ ...editMember, full_name: e.target.value })}
                                                id={`full_name${index}`}
                                            />
                                        ) : (
                                            member.full_name
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === indexOfFirstMember + index ? (
                                            <input
                                                type="email"
                                                value={editMember.full_email}
                                                onChange={(e) => setEditMember({ ...editMember, full_email: e.target.value })}
                                                id={`full_email${index}`}
                                            />
                                        ) : (
                                            member.full_email
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === indexOfFirstMember + index ? (
                                            <input
                                                type="text"
                                                value={editMember.role}
                                                onChange={(e) => setEditMember({ ...editMember, role: e.target.value })}
                                                id={`role${index}`}
                                            />
                                        ) : (
                                            member.role
                                        )}
                                    </td>
                                    <td className="action-buttons">
                                        {editIndex === indexOfFirstMember + index ? (
                                            <button onClick={handleSave} aria-label="Save changes">Save</button>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(indexOfFirstMember + index)} aria-label="Edit member">✏️</button>
                                                <button className="delete" onClick={() => handleDelete(indexOfFirstMember + index)} aria-label="Delete member">🗑️</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={currentPage === i + 1 ? 'active' : ''}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ListView;